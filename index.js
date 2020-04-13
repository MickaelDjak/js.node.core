require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// html templater
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// session
const expressSession = require("express-session");
const MongoSession = require("connect-mongodb-session")(expressSession);
const sessionStore = new MongoSession({
  uri: process.env.MONGO_CONNECTION,
  collection: "sessions",
});

sessionStore.on("error", function (error) {
  console.error("SESSION error !!!");
  console.error("SESSION", error);
});

app.use(
  expressSession({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: sessionStore,
  })
);

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// csrf protection
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// flash
var flash = require("connect-flash");
app.use(flash());

// my middleware
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
    const mongoose = require("mongoose");
    await mongoose.connect(process.env.MONGO_CONNECTION, {
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
