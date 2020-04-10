const bcrype = require("bcryptjs");
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
    const candidate = await User.findOne({
      email: request.body.email,
    });

    if (candidate) {
      const isSame = await bcrype.compare(
        request.body.password,
        candidate.password
      );

      if (isSame) {
        request.session.userId = candidate._id;
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

    const hashPassword = await bcrype.hash(password, 10);

    if ((await User.exists({ email })) === false) {
      const user = new User({ name, email, password: hashPassword });

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
