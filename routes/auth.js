const { Router } = require("express");
const bcrype = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("./../emails/mailer");
const registrationMessege = require("./../emails/registration");
const recoveryPasswordMessege = require("./../emails/recoveryPassword");

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

router.get("/reset", (request, response) => {
  response.render("auth/reset", {
    title: "Востановление пароля",
    messages: request.flash("error"),
  });
});

router.post("/reset", async (request, response) => {
  try {
    crypto.randomBytes(33, async (err, buffer) => {
      if (err) {
        request.flash("error", "Что-то пошло не так, повторите попытку позже!");
        response.redirect("/auth/reset");
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: request.body.email });
      candidate;
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExpiration = Date.now() + 60 * 10 * 1000; // 10 min

        await candidate.save();

        response.redirect("/auth/login");

        await mailer(recoveryPasswordMessege(candidate.email, token));

        return;
      }
      request.flash("error", "Такого email не существует!");
      response.redirect("/auth/reset");
    });
  } catch (e) {
    console.error(e);
    request.flash("error", "Произошла ошибка, повторите попытку позже!");
    response.redirect("/auth/reset");
  }
});

router.get("/password_recovery/:token?", async (request, response) => {
  try {
    if (!request.params.token) {
      return response.redirect("/auth/login");
    }

    const candidate = await User.findOne({
      resetToken: request.params.token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (candidate) {
      response.render("auth/recovery", {
        title: "Востановление пароля",
        recoveryToken: request.params.token,
        userId: candidate._id.toString(),
        isLogin: true,
        messages: request.flash("error"),
      });
    } else {
      response.redirect("/auth/login");
    }
  } catch (e) {
    console.error(e);
    request.flash("error", "Произошла ошибка, повторите попытку позже!");
    response.redirect("/auth/login");
  }
});

router.post("/password_recovery", async (request, response) => {
  try {
    const user = await User.findOne({
      _id: request.body.user_id,
      resetToken: request.body.recovery_token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (user) {
      if (request.body.password !== request.body.password_comfirm) {
        request.flash("error", `Убедитесь что вы вводите пароль верно!`);

        return response.redirect(
          `/auth/password_recovery/${request.body.recovery_token}`
        );
      }

      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      user.password = await bcrype.hash(request.body.password, 10);
      await user.save();

      response.redirect("/auth/login");
    } else {
      request.flash("error", "Ошибка при востановлении пароля!");
      response.redirect("/auth/login");
    }
  } catch (e) {
    console.error(e);
    request.flash("error", "Произошла ошибка, повторите попытку позже!");
    response.redirect("/auth/login");
  }
});

module.exports = router;
