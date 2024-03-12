const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const utils = require("./utils");
const { saveMessage } = require("./server");

const { MessagingResponse } = require("twilio").twiml;

const app = express();
app.use(cors({ origin: ["http://localhost:3000", process.env.APP_DOMAIN] }));
app.use(express.json()); // receive form data
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const twiml = new MessagingResponse();
  console.log("@@@@@@@@@@@@@@ request >>>>>>>>>>>>>>>>>", req);

  const { Body, From, MessageSid, To } = req.body;

  if (req?.body?.Body?.toLowerCase().includes("no")) {
    //Get subscriber data based on contact number
    const subscriber = await db.promise().query(
      `SELECT subscribers.*, routes.delivery_day FROM subscribers
        LEFT JOIN routes ON routes.id = subscribers.route_id
        WHERE phone_number="${From}"`
    );

    console.log(
      "@@@@@@@@@@@@@@@@ subscriber[0][0].status >>>>>>>>>>>>>",
      subscriber[0][0].status
    );

    if (subscriber[0].length) {
      const subscription = await stripe.subscriptions.retrieve(
        subscriber[0][0].subscription_id
      );

      const ONE_DAY = 1 * 24 * 60 * 60;

      const updatedSubscription = await stripe.subscriptions.update(
        subscriber[0][0].subscription_id,
        {
          pause_collection: {
            behavior: "void",
            // Set resume date to be the current period end date + 1 day so that it will skip billing the current cycle
            resumes_at: subscription.current_period_end + ONE_DAY,
          },
        }
      );

      //Save message data
      await saveMessage(Body, From, To, MessageSid);

      //Set status to inactive
      // await db
      //   .promise()
      //   .query(
      //     `UPDATE subscribers SET status="2" WHERE phone_number="${From}"`
      //   );

      const message =
        "We've received your refusal of the delivery for this week. We'll be in touch next week to arrange another delivery. Thank you, and stay safe.\n\nThanks,\nBagels Round Top";
      twiml.message(message);

      //Save message data
      await saveMessage(message, From, To, MessageSid);
    }
  } else if (Body.toLowerCase().includes("unsubscribe")) {
    const subscriber = await db
      .promise()
      .query("SELECT * FROM subscribers where phone_number = ?", [
        req.body.From,
      ]);

    if (subscriber[0].length === 0) {
      return res.status(400).json({ errMessage: "Record not found" });
    } else if (subscriber[0][0].status === "3") {
      const subscription = await stripe.subscriptions.cancel(
        subscriber[0][0].subscription_id
      );

      //SET subscriber status to inactive
      await db
        .promise()
        .query("UPDATE subscribers SET status = ? WHERE id = ? ", [
          2,
          subscriber[0][0].id,
        ]);

      //Save message data
      await saveMessage(Body, From, To, MessageSid);

      const message =
        "You have successfully unsubscribed from our delivery subscription service. We're sorry to see you go, but we respect your decision. If you ever wish to re-subscribe or have any questions, feel free to reach out to our customer support team. Thank you for being a part of our service.\n\nBagels Round Top";
      twiml.message(message);

      //Save message data
      await saveMessage(Body, From, To, MessageSid);
    } else if (subscriber[0][0].status !== "3") {
      twiml.message(
        "Failed to unsubscribe. Please use the unsubscribe facility to continue."
      );
    }
  } else {
    twiml.message("The Robots are coming! Head for the hills!");
  }

  res.type("text/xml").send(twiml.toString());
});

app.listen(8001, () => {
  console.log("Express server listening on port 8001");
});
