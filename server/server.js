
const cors = require("cors");
const express = require("express");
const mysql = require('mysql2');

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
app.use(cors());
app.use(express.json());// receive form data 
// app.use(express.urlencoded({extended: true, limit: '1mb'}))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const STRIPE_DOMAIN = `${process.env.DOMAIN}\bagels`;

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})

app.post("/subscribe", async (req, res) => {
  const { name, address, phone_number, postal_code, quantity } = req.body
  const user = { name, address, phone_number, postal_code, quantity, status: 'active', created_date: new Date() };

  try {    
    await db.promise().query('INSERT INTO subscribers SET ?', user); 
    res.send({"message": 'Successfully subscribed! Stay tuned for more details.'});      
  } catch (err) { 
    console.log(err);
    if( err && err.code == "ER_DUP_ENTRY" )
      res.send({"message": 'Phone Number is already subscribed. Stay tuned for updates!'});    
    else
      res.send({"message": 'Something went wrong, please consult with your provider!'});  
  }
});

app.get("/deliveryList", async (req, res) => {
  try {  
    let data = await db.promise().query('SELECT * FROM subscribers WHERE status = "active"');
    res.send(data[0]); 
  } catch (err) { 
    res.send({"message": 'Something went wrong, please consult with your provider!'});  
  }
});

app.post("/sendSMS", async(req, res) => {  
  try {
    const { phone_number, message } = req.body;
    twilioClient.messages
    .create({
      body: message,
      to: phone_number, // Text your number
      from: '+15702216646', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
  } catch (err) {
    console.log(err);
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `${STRIPE_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${STRIPE_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.post('/create-portal-session', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = STRIPE_STRIPE_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

app.post(
  '/stripe-webhook',
  express.raw({ type: 'application/json' }),
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
      const signature = request.headers['stripe-signature'];
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
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
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