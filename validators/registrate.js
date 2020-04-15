const { body } = require("express-validator");

module.exports = [
  body("name")
    .isLength({ min: 10 })
    .withMessage("Поля `Ваше имя` должно быть дленее 5 символов."),
  body("email")
    .isEmail()
    .withMessage("Поле `E-mail` введен с ошибкой.")
    .normalizeEmail(),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Поле `Пароль` не может быть пустым.")
    .trim()
    .escape()
    .isLength({ min: 3, max: 56 })
    .withMessage("Поле `Пароль` должен содержать от 3 до 56 символов")
    .isAlphanumeric()
    .withMessage(
      "Поле `Пароль` может содержать только латинские буквы и цифры"
    ),
  body("password_comfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Поле `Повторный пароль` не совподает с полем `Пароли`");
    }
    return true;
  }),
];
