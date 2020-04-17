const { validationResult } = require("express-validator");

module.exports = {
  isInvalid(request) {
    return !validationResult(request).isEmpty();
  },

  fill(request) {
    validationResult(request)
      .array()
      .forEach((el) => request.flash("error", el.msg));
  },

  getMessages(request) {
    return validationResult(request)
      .array()
      .map((el) => el.msg);
  },
};
