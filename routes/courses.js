const { Router } = require("express");

const router = Router();
router.get("/", (request, response) => {
  response.render("courses", {
    title: "Курсы",
    isCourses: true
  });
});

module.exports = router;
