module.exports = async function (request, response, next) {
  if (request.session.isAuthoenticated) {
    return next();
  }

  response.redirect("/auth/login");
};
