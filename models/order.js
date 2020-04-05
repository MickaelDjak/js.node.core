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
  }
});

orderSchema.methods.toClient = function () {
  return {
    ...this,
    price: this.courses.reduce((res, el) => {
      return (res += el.price * el.count);
    }, 0),
  };
};

module.exports = model("Order", orderSchema);
