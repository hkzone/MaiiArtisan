const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../../src/server/models/productModel');
// const Review = require('./../../models/reviewModel');
const User = require('../../src/server/models/userModel');
const Config = require('../../src/server/models/configModel');
dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection established'));

//READ JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

//IMPORT DATA TO DB
const importData = async () => {
  try {
    await Product.create(products);
    await Config.create(config);
    // await User.create(users, { validateBeforeSave: false });
    //await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};
//DELETE ALL DATA FROM COLLECTION

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Config.deleteMany();
    // await User.deleteMany();
    //await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
