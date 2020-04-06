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

orderSchema.post("find", async function (orders) {
  for (let order of orders) {
    await order.populate("user courses.courseId").execPopulate();
    order.price = await order.courses.reduce((result, el) => {
      return result + el.courseId.price * el.count;
    }, 0);

    const options = {
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    };

    order.dateOfOrder = order.date.toLocaleString("ru", options);
  }
});

module.exports = model("Order", orderSchema);
