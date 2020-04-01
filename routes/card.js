const { Router } = require("express");
const Card = require("./../models/card");
const Course = require("./../models/course");

const router = Router();

router.get("/", async (request, response) => {
  const card = await Card.find();

  const price = await card.reduce((result, el) => {
    return Number(result) + Number(el.price) * Number(el.count);
  }, 0);

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    courses: card,
    price: price
  });
});

router.delete("/delete/:id", async (request, response) => {
  const card = await Card.findById(request.params.id);

  if (Number(card.count) === 1) {
    await Card.findByIdAndDelete(card.id);
  } else {
    card.count -= 1;
    await card.save();
  }
  const cardAll = await Card.find();
  response.json(cardAll);
});

router.post("/add", async (request, response) => {
  const course = await Course.findById(request.body.id);

  let card = await Card.findOne({
    courseId: request.body.id
  });

  if (card === null) {
    card = new Card({
      courseId: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      img: course.img,
      count: 1
    });
  } else {
    card.count += 1;
  }

  try {
    await card.save();
  } catch (e) {
    console.log(e);
  }

  response.redirect("/card");
});

module.exports = router;
