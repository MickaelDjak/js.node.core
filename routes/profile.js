const { Router } = require("express");

const auth = require("./../middleware/auth");

const router = Router();

router.get("/", auth, async (request, response) => {
  response.render("profile/index", {
    title: "Профиль",
    isProfile: true,
    user: request.user.toObject(),
  });
});

router.post("/", auth, async (request, response) => {
  try {
    const user = request.user;
    user.name = request.body.name;

    if (request.file) {
      user.avatarUrl = request.file.path;
    }

    await user.save();

    response.redirect("/profile/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
