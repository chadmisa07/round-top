
const cors = require("cors");
const express = require("express");
const mysql = require('mysql2');

const accountSid = 'ACdeb7ff11afc99f3d43009a96b6b5b7a1';
const authToken = 'd61107abbf2b1731d8e7417e3f3caeab';
const twilioClient = require('twilio')(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());// receive form data 
// app.use(express.urlencoded({extended: true, limit: '1mb'}))

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bagels'
})

app.post("/subscribe", async (req, res) => {
  const { name, address, phone_number, postal_code, quantity } = req.body
  const user = { name, address, phone_number, postal_code, quantity, status: 'active', created_date: new Date() };

  try {    
    await db.promise().query('INSERT INTO subscribers SET ?', user); 
    res.send({"message": 'Successfully subscribed! Stay tuned for more details.'});      
  } catch (err) { 
    res.send({"message": 'Something went wrong, please consult with your provider!'});  
  }
  //  db.query('INSERT INTO subscribers SET ?', user, (err, output) => {
  //   if( err && err.code != "ER_DUP_ENTRY" ) 
  //     throw err;
  //   else if( err && err.code == "ER_DUP_ENTRY" )
  //     res.send({"message": 'Something went wrong, please consult with your provider!'});    
  //   else
  //     res.send({"message":"yes!"});
  // });
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
  const { phone_number, message } = req.body;
  twilioClient.messages
  .create({
    body: message,
    to: phone_number, // Text your number
    from: '+15702216646', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});