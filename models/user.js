const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  card: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          require: true,
        },
      },
    ],
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

userSchema.methods.addToCard = async function (courseId) {
  const items = [...this.card.items];

  const index = items.findIndex((el) => el.courseId.toString() === courseId);

  if (index === -1) {
    items.push({
      courseId: courseId,
      count: 1,
    });
  } else {
    items[index].count += 1;
  }

  this.card = { items };

  return await this.save();
};

userSchema.methods.removeFromCard = async function (courseId) {
  const items = [...this.card.items];
  const index = items.findIndex((el) => el.courseId.toString() === courseId);

  if (index === -1) {
    return;
  }

  const element = items[index];

  if (element.count === 1) {
    this.card.items = [...items.slice(0, index), ...items.slice(index + 1)];
  } else {
    this.card.items = [
      ...items.slice(0, index),
      {
        ...element._doc,
        count: element.count - 1,
      },
      ...items.slice(index + 1),
    ];
  }

  return await this.save();
};

userSchema.methods.clearCard = async function () {
  this.card.items = [];
  return await this.save();
};

userSchema.methods.fillData = async function () {
  await this.populate("card.items.courseId").execPopulate();
};

userSchema.methods.toClient = function () {
  return this.card.items.reduce(
    ({ courses, price }, { courseId, count }) => {
      const { _id, ...rest } = courseId._doc;

      return {
        courses: [
          ...courses,
          {
            ...rest,
            id: _id,
            count: count,
          },
        ],
        price: price + Number(courseId.price) * Number(count),
      };
    },
    { courses: [], price: 0 }
  );
};

userSchema.methods.isIdEqual = function (otherId) {
  return this._id.toString() == otherId;
};

module.exports = model("User", userSchema);
