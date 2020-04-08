const { Router } = require("express");
const auth = require("./../middleware/auth");

const router = Router();

router.get("/", auth, async (request, response) => {
  const user = request.user;

  await user.fillData();
  const card = user.toClient();

  response.render("card/index", {
    title: "Корзина",
    isCard: true,
    ...card,
  });
});

router.delete("/delete/:id", auth, async (request, response) => {
  const user = request.user;
  await user.removeFromCard(request.params.id);
  await user.fillData();
  const card = user.toClient();

  response.json(card);
});

router.post("/add", auth, async (request, response) => {
  const user = request.user;
  await user.addToCard(request.body.id);

  response.redirect("/card");
});

module.exports = router;
