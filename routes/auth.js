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
  try {
    const user = await User.findOne({
      email: request.body.email,
    });

    if (user) {
      if (user.password === request.body.password) {
        request.session.userId = user._id;
        request.session.isAuthoenticated = true;

        return request.session.save((err) => {
          if (err) {
            throw new Error(err);
          }
          response.redirect("/");
        });
      }
    }

    return response.redirect("/auth/login");
  } catch (e) {
    console.warn(e);
    response.redirect("/");
  }
});

router.post("/registr", async (request, response) => {
  try {
    const { name, email, password, password_comfirm } = request.body;

    if ((await User.exists({ email })) === false) {
      const user = new User({ name, email, password });

      await user.save();
    }

    return response.redirect("/auth/login");
  } catch (e) {
    console.warn(e);
    response.redirect("/");
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy(() => {
    response.redirect("/auth/login");
  });
});

module.exports = router;
