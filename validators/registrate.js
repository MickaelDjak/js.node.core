const { body } = require("express-validator");
const User = require("./../models/user");

module.exports = [
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Поля `Ваше имя` должно быть дленее 5 символов."),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Поле `E-mail` введен с ошибкой.")
    .custom(async (email) => {
      try {
        if (await User.exists({ email })) {
          return Promise.reject(`Пользователь с таким email уже существует!`);
        }
      } catch (e) {
        console.log(e);
      }
    }),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Поле `Пароль` не может быть пустым.")
    .isLength({ min: 3, max: 56 })
    .withMessage("Поле `Пароль` должен содержать от 3 до 56 символов")
    .isAlphanumeric()
    .withMessage(
      "Поле `Пароль` может содержать только латинские буквы и цифры"
    ),
  body("password_comfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "Поле `Повторный пароль` не совподает с полем `Пароли`"
        );
      }
      return true;
    }),
];
