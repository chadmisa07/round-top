
const cors = require("cors");
const express = require("express");
const mysql = require('mysql2');

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());// receive form data 
// app.use(express.urlencoded({extended: true, limit: '1mb'}))

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})

app.post('/sms', (req, res) => {
  console.log(req);
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.type('text/xml').send(twiml.toString());
});

app.listen(8001, () => {
  console.log('Express server listening on port 8001');
});