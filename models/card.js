const fs = require("fs");
const path = require("path");
const Curse = require("./course");

const cardPath = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(course) {
    const cardPrev = await Card.fetch();

    const index = await cardPrev.courses.findIndex(el => el.id === course.id);
    let coursesNext = [];
    if (index === -1) {
      const fetchedCourse = await Curse.findById(course.id);
      coursesNext = await [
        ...cardPrev.courses,
        {
          ...fetchedCourse,
          count: 1
        }
      ];
    } else {
      const targetCoutse = await cardPrev.courses[index];

      coursesNext = await [
        ...cardPrev.courses.slice(0, index),
        {
          ...targetCoutse,
          count: targetCoutse.count + 1
        },
        ...cardPrev.courses.slice(index + 1)
      ];
    }

    const price = await Card.calculatePrice(coursesNext);

    return Card.saveTo(Card.dto(coursesNext, price));
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(cardPath, "utf-8", (err, data) => {
        err ? reject(err) : resolve(JSON.parse(data));
      });
    });
  }

  static async calculatePrice(list) {
    return await list.reduce((result, el) => {
      return Number(result) + Number(el.price) * Number(el.count);
    }, 0);
  }

  static async deleteById(cardId) {
    const cardPrev = await Card.fetch();

    const index = await cardPrev.courses.findIndex(el => el.id === cardId);

    let coursesNext = [];
    if (index === -1) {
      coursesNext = cardPrev;
    } else {
      const targetCoutse = await cardPrev.courses[index];

      if (targetCoutse.count === 1) {
        coursesNext = await [
          ...cardPrev.courses.slice(0, index),
          ...cardPrev.courses.slice(index + 1)
        ];
      } else {
        coursesNext = await [
          ...cardPrev.courses.slice(0, index),
          {
            ...targetCoutse,
            count: targetCoutse.count - 1
          },
          ...cardPrev.courses.slice(index + 1)
        ];
      }
    }

    const price = await Card.calculatePrice(coursesNext);

    return Card.saveTo(Card.dto(coursesNext, price));
  }

  static dto(courses, price) {
    return {
      courses,
      price
    };
  }

  static async saveTo(card) {
    return new Promise((resolve, reject) => {
      fs.writeFile(cardPath, JSON.stringify(card), err => {
        err ? reject(err) : resolve(card);
      });
    });
  }
}

module.exports = Card;
