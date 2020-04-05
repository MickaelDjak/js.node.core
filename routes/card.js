const { Router } = require("express");
const Course = require("./../models/course");
const User = require("./../models/user");

const router = Router();

router.get("/", async (request, response) => {
  const user = await request.user;

  await user.fillData();
  const card = user.toClient();

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    ...card,
  });
});

router.delete("/delete/:id", async (request, response) => {
  const user = await request.user;
  await user.removeFromCard(request.params.id);
  await user.fillData();
  const card = user.toClient();

  response.json(card);
});

router.post("/add", async (request, response) => {
  const user = await request.user;
  await user.addToCard(request.body.id);

  response.redirect("/card");
});

module.exports = router;
