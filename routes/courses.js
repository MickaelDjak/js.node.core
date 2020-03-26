const { Router } = require("express");
const Course = require("./../models/course");

const router = Router();
router.get("/", (request, response) => {
  Course.getAll().then((resolve, reject) => {
    response.render("course/index", {
      courseList: resolve,
      title: "Курсы",
      isCourses: true
    });
  });
});

router.get("/:id/edit", async (request, response) => {
  if (request.query.allow === true) {
    const course = await Course.findById(request.params.id);

    response.render("course/edit", {
      title: `Редактирование ${course.title}`,
      course
    });
  }

  return response.redirect("/");
});

router.get("/create", (request, response) => {
  response.render("course/create", {
    title: "Добавить курс",
    isAdd: true
  });
});

router.post("/store", async (request, response) => {
  const course = new Course(
    request.body.title,
    request.body.description,
    request.body.price,
    request.body.img
  );

  await course.save();

  response.redirect("/courses");
});

router.post("/update", async (request, response) => {
  await Course.update(request.body);

  response.redirect("/courses");
});

router.get("/:id", async (request, response) => {
  if (request.query.allow === false) {
    return response.redirect("/");
  }

  const course = await Course.findById(request.params.id);

  response.render("course/show", {
    layout: "empty",
    title: course.title,
    course
  });
});

module.exports = router;
