const login = require("./login");
const course = require("./course");
const registrate = require("./registrate");
const handler = require("./handler");

module.exports = {
  loginValidator: login,
  registrateValidator: registrate,
  courseValidator: course,
  handler,
};
