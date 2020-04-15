const { validationResult } = require("express-validator");

module.exports = {
  isInvalid(request) {
    return !validationResult(request).isEmpty();
  },

  fill(request) {
    const errors = validationResult(request);

    errors.array().forEach((el) => request.flash("error", el.msg));
  },
};
