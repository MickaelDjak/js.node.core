const { Router } = require("express");
const Card = require("./../models/card");

const router = Router();

router.get("/", async (request, response) => {
  const card = await Card.fetch();

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    courses: card.courses,
    price: card.price
  });
});

router.post("/add", async (request, response) => {
  await Card.add(request.body.id);

  response.redirect("/card");
});

module.exports = router;
