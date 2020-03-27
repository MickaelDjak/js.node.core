const { Router } = require("express");
const Card = require("./../models/card");
const Course = require("./../models/course");

const router = Router();

router.get("/", async (request, response) => {
  const card = await Card.fetch();

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    card
  });
});

router.post("/add", async (request, response) => {
  const course = await Course.findById(request.body.id);

  await Card.add(course);

  response.redirect("/card");
});

module.exports = router;
