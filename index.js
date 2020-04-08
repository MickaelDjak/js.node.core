const express = require("express");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const MongoSession = require("connect-mongodb-session")(expressSession);
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const dbConnectionUrl =
  "mongodb://mdjak:fYibKrsXYRGBWVEQzl0w@localhost:27017/learner";

const app = express();

// html templater
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// other stuff
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// session
const sessionStore = new MongoSession({
  uri: dbConnectionUrl,
  collection: "sessions",
});

sessionStore.on("error", function (error) {
  console.log("SESSION", error);
});

app.use(
  expressSession({
    secret: "GVq4OWSsQ8kuXTy04Ki0",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: sessionStore,
  })
);

// middleware
const variables = require("./middleware/variables");
const user = require("./middleware/user");
const logger = require("./middleware/logger");

app.use(variables);
app.use(user);
app.use(logger);

// router
const homeRoute = require("./routes/home");
const aboutRoute = require("./routes/about");
const coursesRoute = require("./routes/courses");
const cardRoute = require("./routes/card");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");

app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/courses", coursesRoute);
app.use("/card", cardRoute);
app.use("/order", orderRoute);
app.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(dbConnectionUrl, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.warn(e);
  }
}

start();
