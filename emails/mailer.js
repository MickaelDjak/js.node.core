const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SEND_GRID_JS_COURSES_KEY);

module.exports = async function (message) {
  message.from = process.env.MAILING_FROM;
  await mail.send(message);
};
