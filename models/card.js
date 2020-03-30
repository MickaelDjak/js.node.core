const fs = require("fs");
const path = require("path");

const cardPath = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(course) {
    const cardPrev = await Card.fetch();

    const index = cardPrev.courses.findIndex(el => el.id === course.id);

    let coursesNext = [];
    if (index === -1) {
      coursesNext = await [...cardPrev.courses, course];
    } else {
      const targetCoutse = cardPrev[index];

      coursesNext = [
        ...cardPrev.courses.slice(0, index),
        {
          ...targetCoutse,
          count: targetCoutse.count + 1
        },
        ...cardPrev.courses.slice(index + 1)
      ];
    }

    const price = await coursesNext.reduce((result, el) => {
      return result + Number(el.price) * Number(el.count);
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
