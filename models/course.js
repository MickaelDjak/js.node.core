const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

const pathToData = path.join(__dirname, "..", "data", "courses.json");

class Course {
  constructor(title, description, price, img) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.img = img;
    this.id = uuid.v4();
  }

  async save() {
    const courses = await Course.getAll();

    return new Promise((resolve, reject) => {
      fs.writeFile(
        pathToData,
        JSON.stringify([
          ...courses,
          {
            title: this.title,
            description: this.description,
            price: this.price,
            img: this.img,
            id: this.id
          }
        ]),
        err => {
          err ? reject(err) : resolve();
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToData, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
}

module.exports = Course;
