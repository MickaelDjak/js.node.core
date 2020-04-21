const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, collback) {
    collback(null, "./images");
  },
  filename: function (request, file, collback) {
    crypto.randomBytes(10, async (err, buffer) => {
      if (err) {
        request.flash("error", "Что-то пошло не так, повторите попытку позже!");
      }

      const token = buffer.toString("hex");
      collback(null, `avatar_${token}_${file.originalname}`);
    });
  },
});

const allowedTpes = ["image/png", "image/jpeg", "image/jpg"];

const fileFilter = (request, fileName, collback) => {
  collback(null, allowedTpes.includes(fileName.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
