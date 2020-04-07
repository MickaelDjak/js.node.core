const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  courses: [
    {
      courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        require: true,
      },
      count: {
        type: Number,
        require: true,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

async function load(order) {
  await order.populate("user courses.courseId").execPopulate();

  order.price = await order.courses.reduce((result, el) => {
    return result + el.courseId.price * el.count;
  }, 0);

  order.dateOfOrder = order.date.toLocaleString("ru", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

orderSchema.post("find", async function (orders) {
  for (let order of orders) {
    await load(order);
  }
});

module.exports = model("Order", orderSchema);
