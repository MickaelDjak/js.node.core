const fs = require("fs");
const path = require("path");

const cardPath = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(item) {
    const list = await Card.fetch();

    return new Promise((resolve, reject) => {
      fs.writeFile(cardPath, JSON.stringify([...list, item]), (err, data) => {
        err ? reject(err) : resolve();
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(cardPath, "utf-8", (err, data) => {
        err ? reject(err) : resolve(JSON.parse(data));
      });
    });
  }
}

module.exports = Card;
