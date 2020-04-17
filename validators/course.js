const { body } = require("express-validator");

module.exports = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Название курса должно быть дленее 3 символов."),
  body("description")
    .trim()
    .escape()
    .isLength({ min: 100 })
    .withMessage("Описание курса должно быть не менее 100 символов."),
  body("price")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Поле `Цена` не может быть пустым.")
    .isNumeric({ no_symbols: true })
    .withMessage("Поле `Цена` должен содержать только цифры"),
  body("img")
    .trim()
    .isURL()
    .withMessage("Поле `URL картинки` должено быть валлидной ссылкой"),
];
