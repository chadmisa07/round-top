const cors = require("cors");
const express = require("express");
const mysql = require("mysql2");
const utils = require("./utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const app = express();
app.use(cors({ origin: ["http://localhost:3000", process.env.APP_DOMAIN] }));
app.use(express.json()); // receive form data
// app.use(express.urlencoded({extended: true, limit: '1mb'}))
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const STRIPE_DOMAIN = `${process.env.APP_DOMAIN}\bagels`;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ errMessage: "Token is not valid!" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ errMessage: "You are not authenticated!" });
  }
};

const generateToken = (user, secret, noExpiry = true) => {
  return jwt.sign(user, secret, noExpiry ? {} : { expiresIn: "2h" });
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db
    .promise()
    .query("SELECT * FROM users where username = ?", [username]);

  if (user[0].length) {
    // check if password is correct
    if (!(await bcrypt.compareSync(password, user[0][0].password))) {
      return res
        .status(401)
        .json({ errMessage: "Username or password is incorrect." });
    }

    const data = user[0][0];
    // generate access token
    const accessToken = generateToken(
      data,
      process.env.JWT_ACCESS_SECRET_KEY,
      false
    );

    // const refreshToken = generateToken(data, process.env.JWT_REFRESH_SECRET);
    // const userId = user[0][0].id;

    // const existingToken = await db
    //   .promise()
    //   .query("SELECT * FROM refresh_tokens WHERE user_id = ? ", [userId]);

    // insert new refresh token to the database
    // if (existingToken[0].length) {
    //   await db
    //     .promise()
    //     .query("UPDATE refresh_tokens SET token = ? WHERE user_id = ? ", [
    //       refreshToken,
    //       userId,
    //     ]);
    // } else {
    //   await db.promise().query("INSERT INTO refresh_tokens SET ? ", {
    //     user_id: data.id,
    //     token: refreshToken,
    //   });
    // }

    res.status(200).json({
      username: data.username,
      isAdmin: data.isAdmin,
      accessToken,
      // refreshToken,
    });
  } else {
    res.status(401).json({ errMessage: "Username or password is incorrect." });
  }
});

// verify of access token saved in localStorage is still valid
app.post("/verifyToken", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json({ errMessage: "Token is not valid!" });
      } else {
        res.status(200).json({
          accessToken,
          isAdmin: user.isAdmin,
          username: user.username,
        });
      }
    });
  }
});

app.post("/logout", verify, async (req, res) => {
  // const refreshToken = req.body.token;

  // await db
  //   .promise()
  //   .query("DELETE from refresh_tokens WHERE token = ? ", [refreshToken]);

  res.status(200).json({ message: "You have logged out successfully!" });
});

// for refreshing access token
// app.post("/refreshToken", async (req, res) => {
//   // take the refresh token from the user
//   const refreshToken = req.body.token;

//   // send error if there is no token or it's invalid
//   if (!refreshToken) {
//     return res.status(401).json({ errMessage: "You are not authenticated!" });
//   }

//   const token = await db
//     .promise()
//     .query("SELECT * from refresh_tokens WHERE token = ? ", [refreshToken]);

//   if (!token[0].length) {
//     return res.status(403).json({ errMessage: "Refresh token is not valid!" });
//   }

//   jwt.verify(
//     refreshToken,
//     process.env.JWT_REFRESH_SECRET_KEY,
//     async (err, user) => {
//       if (err) {
//         return res.status(403).json({ errMessage: "Token is not valid!" });
//       }

//       // remove from db to invalidate old token
//       await db
//         .promise()
//         .query("DELETE from refresh_tokens WHERE token = ? ", [refreshToken]);

//       console.log("@@@@@@@@@@@@@ user >>>>>>>>>>>>>>", user);
//       const newAccessToken = generateToken(
//         user,
//         process.env.JWT_ACCESS_SECRET_KEY,
//         false
//       );
//       const newRefreshToken = generateToken(
//         user,
//         process.env.JWT_REFRESH_SECRET_KEY
//       );

//       // insert new refresh token to the database
//       const data = await db
//         .promise()
//         .query("INSERT INTO refresh_tokens SET ? ", {
//           user_id: user.id,
//           token: newRefreshToken,
//         });
//       res.status(200).json({
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//         username: user.username,
//         isAdmin: user.isAdmin,
//       });
//     }
//   );
// });

app.delete("/delete/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json({ successMessage: "User has been deleted" });
  } else {
    res
      .status(403)
      .json({ errMessage: "You are not allowed to delete this user!" });
  }
});

app.post("/subscribe", async (req, res) => {
  const { name, address, phone_number, postal_code, quantity, email } =
    req.body;

  const user = {
    name,
    address,
    phone_number,
    postal_code,
    quantity,
    status: 1,
    created_date: new Date(),
    email,
  };

  try {
    const data = await db
      .promise()
      .query("INSERT INTO subscribers SET ?", user);

    res.send({
      message: "Successfully subscribed! Stay tuned for more details.",
      userId: data[0].insertId,
    });
  } catch (err) {
    if (err && err.code == "ER_DUP_ENTRY") {
      res.status(400).send({
        errMessage:
          "Phone Number is already subscribed. Stay tuned for updates!",
      });
    } else {
      res.status(400).send({
        errMessage: "Something went wrong, please consult with your provider!",
      });
    }
  }
});

// Used for updating the subscriber data
app.post("/update-subscriber", async (req, res) => {
  const {
    name,
    address,
    phone_number,
    postal_code,
    quantity,
    email,
    id,
    route_id,
    subscription_id,
    customer_id,
  } = req.body;

  const user = {
    name,
    address,
    phone_number,
    postal_code,
    quantity,
    status: 1,
    created_date: new Date(),
    email,
    route_id,
  };

  try {
    // get the user data saved from the db
    const userData = await db
      .promise()
      .query("SELECT * FROM subscribers WHERE id = ?", [id]);

    if (userData[0][0].route_id !== Number(route_id)) {
      // query route for the actual delivery_day data
      const route = await db
        .promise()
        .query(`SELECT delivery_day from routes WHERE id="${route_id}"`);

      // retrieve the current subscription for the default_payment_method
      const currentSubscription = await stripe.subscriptions.retrieve(
        subscription_id
      );

      // fetch the price id
      const prices = await stripe.prices.list({
        lookup_keys: [String(quantity)],
        expand: ["data.product"],
      });

      // create new subscription for that has correct billing_cycle_anchor
      const newSubscription = await stripe.subscriptions.create({
        customer: customer_id,
        default_payment_method: currentSubscription.default_payment_method,
        billing_cycle_anchor: utils.getStartDay(route[0][0].delivery_day),
        proration_behavior: "none",
        items: [
          {
            price: prices.data[0].id,
          },
        ],
      });

      // update the db with the new subscription_id
      await db
        .promise()
        .query(
          `UPDATE subscribers SET subscription_id="${newSubscription.id}" WHERE id = "${id}" `
        );

      // cancel old subscription as its billing_cycle_anchor is not correct
      await stripe.subscriptions.cancel(subscription_id);

      //UPDATE THE SUBSCRIPTION DATE TO NEXT WEEK
      // const subscription = await stripe.subscriptions.update(subscription_id, {
      //   pause_collection: {
      //     behavior: "keep_as_draft",
      //     resumes_at: utils.getStartDay(new Date(), route[0][0].delivery_day),
      //   },
      // });
    }

    // update the subscribers data
    await db
      .promise()
      .query("UPDATE subscribers SET ? WHERE id = ? ", [user, id]);

    res.status(200).send({
      message: "Successfully updated subscriber data.",
    });
  } catch (err) {
    console.log("@@@@@@ error >>>>>>>>>>>>>>>>>", err);
    res.status(400).json({
      errMessage: "Something went wrong, please consult with your provider!",
    });
  }
});

app.get("/routes", async (req, res) => {
  try {
    let data = await db
      .promise()
      .query(
        "SELECT routes.id, routes.name, CONCAT('Every ', day.description) as delivery_date_desc, routes.delivery_day FROM routes LEFT JOIN day ON routes.delivery_day = day.id"
      );
    res.send(data[0]);
  } catch (err) {
    res.send({
      message: "Something went wrong, please consult with your provider!",
    });
  }
});

// Used for fetching subscribers
app.get("/customers", async (req, res) => {
  try {
    let data = await db
      .promise()
      .query('SELECT * FROM subscribers WHERE status = "1" ORDER BY id DESC');
    res.json(data[0]);
  } catch (err) {
    res.send({
      message: "Something went wrong, please consult with your provider!",
    });
  }
});

// Used for sending SMS
app.post("/sendSMS", async (req, res) => {
  try {
    const { phone_number, message } = req.body;
    twilioClient.messages
      .create({
        body: message,
        to: phone_number, // Text your number
        from: process.env.TWILIO_NUMBER, // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    console.log(err);
  }
});

// Used for creating checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { name, email } = req.body.user_info;
  try {
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    });

    //FOR TESTING PURPOSES ONLY AND MUST BE REMOVED
    const testClock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.floor(new Date().getTime() / 1000),
    });

    const customer = await stripe.customers.create({
      name,
      email,
      test_clock: testClock.id,
    });

    const currentDate = new Date();
    console.log("@@@@@@@@@@@@@@@ currentDate >>>>>>>>>>>>>>>", currentDate);
    console.log(
      "@@@@@@@@@@@@@@@ startDay >>>>>>>>>>>>>>>>>>",
      utils.getStartDay(currentDate.getDay())
    );
    console.log("@@@@@@@@@@@@@@@ prices >>>>>>>>>>>>>>>>>>>>", prices);
    console.log("@@@@@@@@@@@@@@@ customer >>>>>>>>>>>>>>>>>>", customer);

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      //Used to set the billing period to start on the next monday for date uniformity when billing the customers
      subscription_data: {
        billing_cycle_anchor: utils.getStartDay(currentDate.getDay()),
        proration_behavior: "none",
      },
      mode: "subscription",
      success_url: `${process.env.APP_DOMAIN}/{CHECKOUT_SESSION_ID}__${req.body.userId}`,
      cancel_url: `${process.env.APP_DOMAIN}/sendSMS`,
    });

    if (session?.url) {
      res.json({ url: session.url, clientSecret: session.client_secret });
    }
  } catch (err) {
    res.status(400).send({
      errMessage: err,
    });
  }
});

// Used for pausing subscription when the client reply no
app.post("/pause-subscription", async (req, res) => {
  try {
    await stripe.subscriptions.update(req.body.subscription_id, {
      pause_collection: {
        behavior: "keep_as_draft",
        resumes_at: utils.getStartDay(),
      },
    });

    res.status(200).json({ message: "Subscription successfully paused!" });
  } catch (error) {
    res.status(400).send({
      errMessage: "Something went wrong, please consult with your provider!",
    });
  }
});

// Used for setting value to subscription_id for reference
app.post("/set-subscription", async (req, res) => {
  const { session_id: params } = req.body;
  const session_id = params.split("__")[0];
  const user_id = params.split("__")[1];

  try {
    const data = await stripe.checkout.sessions.retrieve(session_id);

    //SET subscription_id of the newly subscribed user
    db.promise().query(
      `UPDATE subscribers SET subscription_id="${data.subscription}", customer_id="${data.customer}" where id="${user_id}"`
    );

    res.json({ subscriptionId: data.subscription });
  } catch (error) {
    res.status(400).send({
      errMessage: "Something went wrong, please consult with your provider!",
    });
  }
});

// Used for client unsubscribe
app.post("/unsubscribe", async (req, res) => {
  const subscriber = await db
    .promise()
    .query("SELECT * FROM subscribers where phone_number = ?", [
      req.body.phoneNumber,
    ]);

  if (subscriber[0].length === 0) {
    res.status(400).json({ errMessage: "Phone number is incorrect." });
  } else {
    //SET subscriber status to unsubscribing and will go to inactive after responding unsubscribe to the text message
    await db
      .promise()
      .query("UPDATE subscribers SET status = ? WHERE id = ? ", [
        3,
        subscriber[0][0].id,
      ]);

    res.status(200).json({
      message:
        "You have successfully applied for unsubscription. Please respond to the confirmation text message sent to your mobile number.",
    });
  }
});

//Used for retrieving subscription info
app.get("/retrieve-subscription", async (req, res) => {
  const { subscription_id } = req.query;

  const data = await stripe.invoices.list({ subscription: subscription_id });
  console.log("@@@@@@@@@@@@@@@@@ data >>>>>>>>>>>>>>>>>", data.data.length);
  res.json({ data: data.data });
});

//UNUSED
app.post("/create-portal-session", async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = STRIPE_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: process.env.APP_DOMAIN,
  });

  res.json({ url: portalSession.url });
});

app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = process.env.STRIPE_SECRET;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case "customer.subscription.created":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case "subscription_schedule.aborted":
        const subscriptionScheduleAborted = event.data.object;
        // Then define and call a function to handle the event subscription_schedule.aborted
        break;
      case "subscription_schedule.canceled":
        const subscriptionScheduleCanceled = event.data.object;
        // Then define and call a function to handle the event subscription_schedule.canceled
        break;
      case "subscription_schedule.expiring":
        const subscriptionScheduleExpiring = event.data.object;
        // Then define and call a function to handle the event subscription_schedule.expiring
        break;
      // ... handle other event types
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
