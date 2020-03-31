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

    const nextCoures = [
      ...courses,
      {
        title: this.title,
        description: this.description,
        price: this.price,
        img: this.img,
        id: this.id
      }
    ];

    return new Promise((resolve, reject) => {
      fs.writeFile(pathToData, JSON.stringify(nextCoures), err => {
        err ? reject(err) : resolve();
      });
    });
  }

  static async update(data) {
    const courses = await Course.getAll();

    const index = courses.findIndex(course => course.id === data.id);

    const nextCoures = [
      ...courses.slice(0, index),
      {
        title: data.title,
        description: data.description,
        price: data.price,
        img: data.img,
        id: data.id
      },
      ...courses.slice(index + 1)
    ];

    return new Promise((resolve, reject) => {
      fs.writeFile(pathToData, JSON.stringify(nextCoures), err => {
        err ? reject(err) : resolve();
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToData, "utf-8", (err, data) => {
        err ? reject(err) : resolve(JSON.parse(data));
      });
    });
  }

  static async findById(id) {
    const courses = await Course.getAll();

    return courses.find(el => el.id === id);
  }

  static async findByIdList(idList) {
    const courses = await Course.getAll();

    return courses.filter(el => {
      return idList.some(id => id === el.id);
    });
  }
}

module.exports = Course;
