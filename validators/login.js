const { body } = require("express-validator");

module.exports = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Поле `E-mail` введен с ошибкой."),
  body("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Поле `Пароль` не может быть пустым.")
    .isLength({ min: 3, max: 56 })
    .withMessage("Поле `Пароль` должен содержать от 3 до 56 символов")
    .isAlphanumeric()
    .withMessage(
      "Поле `Пароль` может содержать только латинские буквы и цифры"
    ),
];
