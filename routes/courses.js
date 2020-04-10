const { Router } = require("express");
const auth = require("./../middleware/auth");
const Course = require("./../models/course");

const router = Router();

router.get("/", async (request, response) => {
  const courses = await Course.find();

  response.render("course/index", {
    courses: courses,
    title: "Курсы",
    isCourses: true,
  });
});

router.get("/:id/edit", auth, async (request, response) => {
  if (request.query.allow !== "true") {
    return response.redirect("/");
  }
  const course = await Course.findById(request.params.id);

  response.render("course/edit", {
    title: `Редактирование ${course.title}`,
    course,
  });
});

router.get("/create", auth, (request, response) => {
  response.render("course/create", {
    title: "Добавить курс",
    isCreate: true,
  });
});

router.get("/:id", async (request, response) => {
  if (request.query.allow === false) {
    return response.redirect("/");
  }

  const course = await Course.findById(request.params.id).populate(
    "userId",
    "email name"
  );

  response.render("course/show", {
    layout: "empty",
    title: course.title,
    course,
  });
});

router.post("/store", auth, async (request, response) => {
  const course = new Course({
    title: request.body.title,
    description: request.body.description,
    price: request.body.price,
    img: request.body.img,
    userId: request.user.id,
  });

  try {
    await course.save();
  } catch (e) {
    console.warn(e);
  }

  response.redirect("/courses");
});

router.post("/update", auth, async (request, response) => {
  const { id, ...data } = request.body;
  await Course.findByIdAndUpdate(id, data);

  response.redirect("/courses");
});

router.post("/remove", auth, async (request, response) => {
  try {
    await Course.deleteOne({ _id: request.body.id });
  } catch (e) {
    console.log(e);
  }

  response.redirect("/courses");
});

module.exports = router;
