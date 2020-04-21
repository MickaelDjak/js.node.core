require("dotenv").config();

const express = require("express");
const app = express();

var compression = require("compression");
app.use(compression());

const helmet = require("helmet");
app.use(helmet());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
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
  helpers: require("./utils/hbs-helper"),
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

const fileUploader = require("./middleware/file");
app.use(fileUploader.single("avatar"));

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

// my before middleware
app.use(require("./middleware/variables"));
app.use(require("./middleware/user"));
// app.use(require("./middleware/logger"));

// router
app.use("/", require("./routes/home"));
app.use("/courses", require("./routes/courses"));
app.use("/card", require("./routes/card"));
app.use("/order", require("./routes/order"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));

// my after middleware
app.use(require("./middleware/error"));

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const mongoose = require("mongoose");
    await mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    const fs = require("fs");
    var dir = "./images";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.warn(e);
  }
}

start();
