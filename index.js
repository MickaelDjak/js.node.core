const express = require("express");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const homeRoute = require("./routes/home");
const aboutRoute = require("./routes/about");
const coursesRoute = require("./routes/courses");
const cardRoute = require("./routes/card");

const User = require("./models/user");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(async (request, response, next) => {
  try {
    request.user = await User.findById("5e87908a29e6c822440b8e70");
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/courses", coursesRoute);
app.use("/card", cardRoute);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(
      "mongodb://mdjak:fYibKrsXYRGBWVEQzl0w@localhost:27017/learner",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    const candidat = await User.findOne();
    if (!candidat) {
      const user = User({
        email: "mdjak@gmail.com",
        name: "Misha Djak",
        card: { items: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.warn(e);
  }
}

start();
