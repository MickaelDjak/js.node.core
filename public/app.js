document.querySelectorAll(".price").forEach(el => {
  el.textContent = new Intl.NumberFormat("ru-RU", {
    currency: "uah",
    style: "currency"
  }).format(el.textContent);
});
