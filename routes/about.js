const { Router } = require("express");

const router = Router();
router.get("/", (request, response) => {
  response.render("about", {
    title: "О нас",
    isAbout: true
  });
});
module.exports = router;
