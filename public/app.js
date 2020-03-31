function toCurrency(price) {
  return new Intl.NumberFormat("ru-RU", {
    currency: "uah",
    style: "currency"
  }).format(price);
}

document.querySelectorAll(".price").forEach(el => {
  console.log("LEARNER: price formatter is done!");
  el.textContent = toCurrency(el.textContent);
});

const cardHtml = document.querySelector("#card");

if (cardHtml !== null) {
  console.log("LEARNER: remove course is done!");

  addEventListener("click", event => {
    if (event.target.classList.contains("card-on-delete")) {
      const id = event.target.dataset.id;

      fetch(`card/delete/${id}`, {
        method: "delete"
      })
        .then(res => res.json())
        .then(card => {
          cardHtml.innerHTML = renderCard(card);
        });
    }
  });
}

function renderCard(card) {
  if (card.courses.length) {
    const html = card.courses.map((item, index) => {
      const price = toCurrency(item.price);

      return `<tr>
          <th scope="row">${index}</th>
          <td>${item.title}</td>
          <td class="price"> ${price}</td>
          <td> ${item.count}</td>
          <td><button class="btn btn-small card-on-delete" data-id=${item.id}>Удалить</button> </td>
        </tr>`;
    });

    const price = toCurrency(card.price);

    return `
              <div id="card">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">Название</th>
          <th scope="col">Цена</th>
          <th scope="col">Количество</th>
          <th scope="col">Действия</th>
        </tr>
      </thead>
      <tbody>
      ${html}
      </tbody>
    </table>
  </div>
  <p>Цена <span class="price big">${price}</span></p>`;
  }

  return "<p>Корзина пуста</p>";
}
