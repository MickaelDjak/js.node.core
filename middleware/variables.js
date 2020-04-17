module.exports = function (request, response, next) {
  response.locals.isAuth = request.session.isAuthoenticated || false;
  response.locals.csrfToken = request.csrfToken();
  response.locals.errorMessages = request.flash("error");
  next();
};
