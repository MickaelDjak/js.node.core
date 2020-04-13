const { Router } = require("express");
const auth = require("./../middleware/auth");
const Course = require("./../models/course");

const router = Router();

router.get("/", async (request, response) => {
  try {
    const courses = await Course.find();

    response.render("course/index", {
      courses: courses,
      userId: request.user ? request.user._id.toString() : null,
      title: "Курсы",
      isCourses: true,
    });
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

router.get("/:id/edit", auth, async (request, response) => {
  try {
    if (request.query.allow !== "true") {
      return response.redirect("/courses");
    }
    const course = await Course.findById(request.params.id);

    if (request.user.isIdEqual(course.userId)) {
      return response.render("course/edit", {
        title: `Редактирование ${course.title}`,
        course,
      });
    }
    response.redirect("/courses");
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

router.get("/create", auth, (request, response) => {
  response.render("course/create", {
    title: "Добавить курс",
    isCreate: true,
  });
});

router.get("/:id", async (request, response) => {
  try {
    if (request.query.allow !== "true") {
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
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

router.post("/store", auth, async (request, response) => {
  try {
    const course = new Course({
      title: request.body.title,
      description: request.body.description,
      price: request.body.price,
      img: request.body.img,
      userId: request.user.id,
    });

    await course.save();

    response.redirect("/courses");
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

router.post("/update", auth, async (request, response) => {
  try {
    const { id, ...data } = request.body;
    const course = await Course.findById(id);
    if (request.user.isIdEqual(course.userId)) {
      await Course.findByIdAndUpdate(id, data);
    }

    response.redirect("/courses");
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

router.post("/remove", auth, async (request, response) => {
  try {
    const course = await Course.findById(id);
    if (request.user.isIdEqual(course.userId)) {
      await Course.deleteOne({ _id: request.body.id });
    }

    response.redirect("/courses");
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

module.exports = router;
