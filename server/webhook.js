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
app.use(cors());
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

      console.log(
        "@@@@@@@@@@@@@ subscription.current_period_end >>>>>>>>>>>",
        subscription.current_period_end
      );

      const updatedSubscription = await stripe.subscriptions.update(
        subscriber[0][0].subscription_id,
        {
          pause_collection: {
            behavior: "keep_as_draft",
            // Get the next payment date based on the current period end date
            // resumes_at: utils.getNextDeliveryDate(
            //   new Date(subscription.current_period_end * 1000)
            //   // subscriber[0][0].delivery_day
            // ),
            resumes_at: new Date(subscription.current_period_end * 1000),
          },
        }
      );

      return res.json(updatedSubscription);
    }
  }

  twiml.message("The Robots are coming! Head for the hills!");

  res.type("text/xml").send(twiml.toString());
});

app.listen(8001, () => {
  console.log("Express server listening on port 8001");
});
