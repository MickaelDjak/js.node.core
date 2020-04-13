const { Router } = require("express");
const bcrype = require("bcryptjs");
const mailer = require("./../emails/mailer");
const registrationMessege = require("./../emails/registration");

const User = require("./../models/user");

const router = Router();

router.get("/login", (request, response) => {
  response.render("auth/login", {
    title: "Регистрация",
    isLogin: true,
    messages: request.flash("error"),
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

    request.flash("error", `Ошибка при попытке войти в учетную запись`);
    return response.redirect("/auth/login#login");
  } catch (e) {
    console.warn(e);
    response.redirect("/");
  }
});

router.post("/registr", async (request, response) => {
  try {
    const { name, email, password, password_comfirm } = request.body;

    if (password !== password_comfirm) {
      request.flash("error", `Убедитесь что вы вводите пароль верно!`);

      return response.redirect("/auth/login#registrate");
    }

    const hashPassword = await bcrype.hash(password, 10);

    if (await User.exists({ email })) {
      request.flash("error", `Пользователь с таким email уже существует!`);

      return response.redirect("/auth/login#registrate");
    }

    const user = new User({ name, email, password: hashPassword });

    await user.save();

    response.redirect("/auth/login#login");

    await mailer(registrationMessege(email));
  } catch (e) {
    console.error(e);
    if (e.response) {
      console.error(error.response.body);
    }
    response.redirect("/");
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy(() => {
    response.redirect("/auth/login#login");
  });
});

module.exports = router;
