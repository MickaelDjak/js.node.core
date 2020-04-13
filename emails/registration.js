module.exports = function (toMail) {
  return {
    to: toMail,
    subject: "Регистрация на learner",
    html: `
<h1>Добро пожаловать в наш магазин</h1>
<p>Вы успешно создали аккаунт ${toMail}</p>
<h1/>
<a href=${process.env.BASE_URL}>Перейти в магазин</a>
`,
  };
};
