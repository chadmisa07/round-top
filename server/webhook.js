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
// app.use(express.urlencoded({extended: true, limit: '1mb'}))

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

  if (req.body.response === "no") {
    //Get subscriber data based on contact number
    const subscriber = await db.promise().query(
      `SELECT subscribers.*, routes.delivery_day FROM subscribers
        LEFT JOIN routes ON routes.id = subscribers.route_id
        WHERE phone_number="${req.body.phoneNumber}"`
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

      return res.json(updatedSubscription);
    }
  } else if (req.body.response === "unsubscribe") {
    const subscriber = await db
      .promise()
      .query("SELECT * FROM subscribers where phone_number = ?", [
        req.body.phoneNumber,
      ]);

    if (subscriber[0].length === 0) {
      return res.status(400).json({ errMessage: "Record not found" });
    } else {
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

      return res.status(200).json({
        message:
          "You have successfully applied for unsubscription. Please respond to the confirmation text message sent to your mobile number.",
      });
    }
  }

  twiml.message("The Robots are coming! Head for the hills!");

  res.type("text/xml").send(twiml.toString());
});

app.listen(8001, () => {
  console.log("Express server listening on port 8001");
});
