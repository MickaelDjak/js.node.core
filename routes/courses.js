const { Router } = require("express");
const Course = require("./../models/course");

const router = Router();
router.get("/", (request, response) => {
  Course.getAll().then((resolve, reject) => {
    response.render("courses", {
      courseList: resolve,
      title: "Курсы",
      isCourses: true
    });
  });
});

module.exports = router;
