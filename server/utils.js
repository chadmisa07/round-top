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
  console.log(
    "@@@@@@@@@@@@@@@@@@ nextMonday >>>>>>>>>>>>>>>>>>>>",
    nextDelivery
  );
  return Math.floor(new Date(nextDelivery.setHours(9, 30, 0)).getTime() / 1000);
}

function getNextDeliveryDate(periodEnd) {
  const periodEndDate = new Date(periodEnd * 1000);
  const nextDeliveryDate = new Date(periodEndDate);
  nextDeliveryDate.setDate(periodEndDate.getDate() + 7);
  console.log("@@@@@@@@@@@@ periodEndDate >>>>>>>>>>>>>>>>", periodEndDate);
  console.log("@@@@@@@@@@@@ nextDeliveryDate >>>>>>>>>>>>>", nextDeliveryDate);
  const result = Math.floor(
    new Date(nextDeliveryDate.setHours(9, 30, 0)).getTime() / 1000
  );
  console.log("@@@@@@@@@@@@ result >>>>>>>>>>>>>>>>>>>>>>>", result);
  return result;

  // const today = new Date();
  // const currentDay = new Date(date).getDay();
  // let dayOfWeek = today.getDay(); // 0 (Sunday) through 6 (Saturday)
  // let daysUntilDeliveryDate = currentDay - dayOfWeek; // Calculate days until delivery date
  // if (daysUntilDeliveryDate <= 0) {
  //   daysUntilDeliveryDate += 7; // If today is Monday or later, get the next Monday
  // }

  // console.log(
  //   "@@@@@@@@ daysUntilDeliveryDate >>>>>>>>>>>>",
  //   daysUntilDeliveryDate
  // );
  // let nextDelivery = today;
  // nextDelivery.setDate(today.getDate() + daysUntilDeliveryDate); // Set date to the next delivery date
  // console.log(
  //   "@@@@@@@@@@@@@@@@@@ nextMonday >>>>>>>>>>>>>>>>>>>>",
  //   nextDelivery
  // );
  // return Math.floor(new Date(nextDelivery.setHours(9, 30, 0)).getTime() / 1000);
}

async function encryptPassword(password) {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
}

console.log(getNextDeliveryDate(1710120600 * 1000));

module.exports = {
  getStartDay,
  getNextDeliveryDate,
};
