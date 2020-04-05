const { Router } = require("express");
const Order = require("./../models/order");
const router = Router();

router.get("/", async (request, response) => {
  const orders = await Order.find({ user: request.user._id });

  response.render("order/index", {
    title: "Заказы",
    isOrder: true,
    orders,
    // ...order.toClient(),
  });
});

router.post("/", async (request, response) => {
  try {
    const user = await request.user;

    await user.fillData();

    const data = user.toClient();

    const order = new Order({
      user: user._id,
      courses: [
        ...data.courses.map((el) => {
          return {
            courseId: el.id,
            count: el.count,
          };
        }),
      ],
    });

    await order.save();

    await user.clearCard();

    response.redirect("/order");
  } catch (e) {
    console.log(e);
    response.redirect("/");
  }
});

module.exports = router;
