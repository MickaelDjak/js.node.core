const { Router } = require("express");

const User = require("./../models/user");

const router = Router();

router.get("/login", (request, response) => {
  response.render("auth/login", {
    title: "Регистрация",
    isLogin: true,
  });
});

router.post("/login", async (request, response) => {
  const user = await User.findOne({
    email: request.body.email,
  });

  if (user) {
    request.session.isAuthoenticated = true;
    request.session.userId = user._id;

    request.session.save((err) => {
      if (err) {
        throw new Error(err);
      }
      response.redirect("/");
    });
  } else {
    response.redirect("/");
  }
});

router.post("/registr", async (request, response) => {
  request.session.isAuthoenticated = true;

  response.redirect("/");
});

router.get("/logout", (request, response) => {
  request.session.destroy(() => {
    response.redirect("/auth/login");
  });
});

module.exports = router;
