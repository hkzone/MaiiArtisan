const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product name is required'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A product name must have less or equal then 40 characters',
      ],
      minLength: [
        8,
        'A product name must have more or equal then 10 characters',
      ],
      //validate: [validator.isAlpha, 'A product name must only contain characters'],
    },
    slug: String,
    ingredients: [
      {
        type: String,
        required: [true, 'A product must have ingredients'],
      },
    ],
    weight: [
      {
        type: Number,
        required: [true, 'A product must have weight'],
      },
    ],
    size: [
      {
        sizeValue: Number,
        sizeUnit: String,
      },
    ],
    orderByWeight: {
      type: Boolean,
      required: [
        true,
        'A product must have a order by weight property specified',
      ],
      default: false,
    },
    customColors: {
      type: Boolean,
      required: [true, 'A product must have a custom colors option specified'],
      default: false,
    },
    customFlavors: {
      type: Boolean,
      required: [true, 'A product must have a custom flavors option specified'],
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 0'],
      max: [5, 'A rating must be bellow or equal 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A product price is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price; //100<200
        },
        message: 'Discount price ({VALUE}) must be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    secretProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, 'A product must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ name: 1 });

// productSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

//Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// productSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// productSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// productSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// productSchema.pre('find', function(next) {
productSchema.pre(/^find/, function (next) {
  this.find({ secretProduct: { $ne: true } });

  this.start = Date.now();
  next();
});

//FIXME: no need this kind?
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt',
//   });
//   next();
// });

// productSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// productSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretProduct: { $ne: true } } });

//   // console.log(this.pipeline());
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
