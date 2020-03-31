const { Router } = require("express");
const Course = require("./../models/course");

const router = Router();
router.get("/", async (request, response) => {
  const courses = await Course.find();

  response.render("course/index", {
    courses: courses,
    title: "Курсы",
    isCourses: true
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
    isCreate: true
  });
});

router.post("/store", async (request, response) => {
  const course = new Course({
    title: request.body.title,
    description: request.body.description,
    price: request.body.price,
    img: request.body.img
  });

  try {
    await course.save();

    response.redirect("/courses");
  } catch (e) {
    console.warn(e);
  }
});

router.post("/update", async (request, response) => {
  const { id, ...updated } = request.body;
  await Course.findByIdAndUpdate(id, updated);

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
