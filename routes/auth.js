const { Router } = require("express");

const router = Router();
router.get("/login", (request, response) => {
  response.render("auth/login", {
    title: "Регистрация",
    isLogin: true,
  });
});

module.exports = router;
