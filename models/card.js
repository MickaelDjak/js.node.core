const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  count: { type: Number, required: true }
});

module.exports = model("Card", cardSchema);
