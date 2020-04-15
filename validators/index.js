const login = require("./login");
const registrate = require("./registrate");
const handler = require("./handler");

module.exports = {
  loginValidator: login,
  registrateValidator: registrate,
  handler,
};
