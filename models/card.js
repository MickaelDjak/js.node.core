const fs = require("fs");
const path = require("path");

const cardPath = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(cours) {
    const cardPrev = await Card.fetch();

    const coursesNext = await [...cardPrev.courses, cours];

    const price = await coursesNext.reduce((result, el) => {
      return result + Number(el.price);
    }, 0);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        cardPath,
        JSON.stringify({
          courses: coursesNext,
          price: price
        }),
        err => {
          err ? reject(err) : resolve();
        }
      );
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
