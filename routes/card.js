const { Router } = require("express");
const Card = require("./../models/card");

const router = Router();

router.get("/", async (request, response) => {
  const card = await Card.fetch();
  console.log([card._id, card.title, card.price]);

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    courses: card.courses,
    price: card.price
  });
});

router.delete("/delete/:id", async (request, response) => {
  const card = await Card.deleteById(request.params.id);

  response.json(card);
});

router.post("/add", async (request, response) => {
  await Card.add(request.body);

  response.redirect("/card");
});

module.exports = router;
