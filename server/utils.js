const bcrypt = require("bcryptjs");

function getStartDay(currentDay = 1) {
  const today = new Date();
  let dayOfWeek = today.getDay(); // 0 (Sunday) through 6 (Saturday)
  let daysUntilDeliveryDate = currentDay - dayOfWeek; // Calculate days until delivery date
  if (daysUntilDeliveryDate <= 0) {
    daysUntilDeliveryDate += 7; // If today is Monday or later, get the next Monday
  }
  let nextDelivery = new Date(today);
  nextDelivery.setDate(today.getDate() + daysUntilDeliveryDate); // Set date to the next delivery date

  return Math.floor(new Date(nextDelivery.setHours(0, 0, 0)).getTime() / 1000);
}

// function getNextDeliveryDate(periodEnd) {
//   const periodEndDate = new Date(periodEnd * 1000);
//   const nextDeliveryDate = new Date(periodEndDate);
//   nextDeliveryDate.setDate(periodEndDate.getDate() + 7);
//   console.log("@@@@@@@@@@@@ periodEndDate >>>>>>>>>>>>>>>>", periodEndDate);
//   console.log("@@@@@@@@@@@@ nextDeliveryDate >>>>>>>>>>>>>", nextDeliveryDate);
//   const result = Math.floor(
//     new Date(nextDeliveryDate.setHours(9, 30, 0)).getTime() / 1000
//   );
//   console.log("@@@@@@@@@@@@ result >>>>>>>>>>>>>>>>>>>>>>>", result);
//   return result;
// }

function getNextDeliveryDate(periodEnd) {
  const periodEndDate = new Date(periodEnd * 1000);
  const nextDeliveryDate = new Date(periodEndDate);
  nextDeliveryDate.setDate(periodEndDate.getDate() + 7);

  const result = Math.floor(
    new Date(nextDeliveryDate.setHours(9, 30, 0)).getTime() / 1000
  );

  return result;
}

async function encryptPassword(password) {
  const encryptedPassword = await bcrypt.hash(
    password + process.env.PASSWORD_SECRET,
    10
  );

  return encryptedPassword;
}

const saveMessage = async (body, from, to, sid, db) => {
  const messageParams = {
    body,
    to,
    from,
    sms_id: sid,
    date: new Date(),
  };

  //Save message data
  await db.promise().query("INSERT INTO messages SET ?", messageParams);
};

module.exports = {
  getStartDay,
  getNextDeliveryDate,
  saveMessage,
};
