module.exports = function (toMail, token) {
  return {
    to: toMail,
    subject: "learner. Востановление пароля",
    html: `
<h1>Восстановление  пароля</h1>
<p>Если нет, то проигнорируйте данное письмо</p>
<p>иначе перейдите по ссылке ниже</p>
<a href=${process.env.BASE_URL}/auth/password_recovery/${token}>Востановить пароль</a>

<h1/>
<a href=${process.env.BASE_URL}>Перейти в магазин</a>
`,
  };
};
