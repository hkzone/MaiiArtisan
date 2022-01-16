const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  //if (!req.files || !req.files.imageCover || !req.files.images) return next();

  if (!req.files) return next();

  //1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 2000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`src/server/public/images/products/${req.body.imageCover}`);
  }

  //2)Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(req.files.images[i].buffer)
          .resize(2000, 2000)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
