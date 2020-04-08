const { Router } = require("express");
const auth = require("./../middleware/auth");
const Order = require("./../models/order");
const router = Router();

router.get("/", auth, async (request, response) => {
  const user = request.user;
  const orders = await Order.find({ user: user._id });

  response.render("order/index", {
    title: "Заказы",
    isOrder: true,
    orders: orders,
  });
});

router.post("/", auth, async (request, response) => {
  try {
    const user = request.user;

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
