module.exports = async function (request, response, next) {
  console.log([
    "#####################",
    "#####################",
    request.session,
    response.locals,
    "#####################",
    "#####################",
  ]);
  next();
};
