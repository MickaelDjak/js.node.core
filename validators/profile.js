const { body } = require("express-validator");

module.exports = [
  body("name")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Название курса должно быть дленее 3 символов."),

  body("img")
    .trim()
    .isURL()
    .withMessage("Поле `URL картинки` должено быть валлидной ссылкой"),
];
