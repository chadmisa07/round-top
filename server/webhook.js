const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const utils = require("./utils");

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
  console.log("@@@@@@@@@@@@@@ request.body >>>>>>>>>>>>>>>>>", req.body);

  const { Body, From, MessageSid } = req.body;

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
      if (subscriber[0][0].status === 3) {
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

        const message = {
          body: Body,
          user_id: subscriber[0][0].id,
          sms_id: MessageSid,
          date: new Date(),
        };

        //Save message data
        await db.promise().query("INSERT INTO messages SET ?", message);

        //Set status to inactive
        await db
          .promise()
          .query(
            `UPDATE subscribers SET status="2" WHERE phone_number="${From}"`
          );

        twiml.message(
          "We've received your refusal of the delivery for this week. We'll be in touch next week to arrange another delivery. Thank you, and stay safe.\n\nWarm regards,\nYour Bagels Round Top Family"
        );
      }
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

      const message = {
        body: Body,
        user_id: subscriber[0][0].id,
        sms_id: MessageSid,
        date: new Date(),
      };

      //Save message data
      await db.promise().query("INSERT INTO messages SET ?", message);

      twiml.message(
        "You have successfully unsubscribed from our delivery subscription service. We're sorry to see you go, but we respect your decision. If you ever wish to re-subscribe or have any questions, feel free to reach out to our customer support team. Thank you for being a part of our service.\n\nBagels Round Top"
      );
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
