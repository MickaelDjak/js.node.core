const User = require("../models/user");

module.exports = async function (request, response, next) {
  if (request.session.userId) {
    request.user = await User.findById(request.session.userId);
  }
  next();
};
