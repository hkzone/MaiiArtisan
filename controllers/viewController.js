const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Config = require('../models/configModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Security = require('../utils/security');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getIndex = catchAsync(async (req, res, next) => {
  //1) Get Feaured Product data from collection
  const products = await Product.find({ isFeatured: true }).limit(14);
  console.log('isLoggedIn');
  //2) Build template
  //3) Render that template using data from step 1
  //3) Render  template

  res.status(200).render('index', { products: products, user: res.user });
});

// exports.getOverview = catchAsync(async (req, res, next) => {
//   //1) Get Product data from collection
//   const products = await Product.find();
//   //2) Build template
//   //3) Render that template using data from step 1
//   res.status(200).render('overview', { title: 'All products', products });
// });

exports.getProduct = catchAsync(async (req, res, next) => {
  //1) Get the data for the requested product
  const product = await Product.findOne({ slug: req.params.slug });
  /*.populate({
    path: 'reviews',
    fields: 'review rating user',
  })*/
  const config = await Config.findOne({});

  if (!product) {
    return next(new AppError('There is no product with this name', 404));
  }
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totals: 0.0,
      formattedTotals: '',
    };
  }

  //2) Build template

  //3) Render that template using data from step 1)

  res.status(200).render('product', {
    title: `${product.name}`,
    product: product,
    nonce: Security.md5(req.sessionID + req.headers['user-agent']),
    maxLength: config.customMessageLength,
    color: config.customColors,
    flavor: config.customFlavor,
    options: config.specialRequestOptions,
    user: res.user,
  });
});

exports.getLoginForm = (req, res) => {
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "script-src 'self' cdn.jsdelivr.net  blob: data: gap:"
  // );

  res.status(200).render('login', { title: 'Login', user: res.user });
};
exports.getSignupForm = (req, res) => {
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "script-src 'self' cdn.jsdelivr.net  blob: data: gap:"
  // );
  // console.log(User.schema.path('address.region').enumValues);
  const region = User.schema.path('address.region').enumValues;
  const district = User.schema.path('address.dcDistrict').enumValues;
  res.status(200).render('signup', {
    title: 'Signup',
    region: region,
    district: district,
    user: res.user,
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};

exports.getMyProducts = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const orders = await Booking.find({ user: req.user.id });
  console.log(orders);

  // 2) Find products with the returned IDs
  //const productIDs = orders.map((el) => el.product);
  //const products = await Product.find({ _id: { $in: productIDs } });

  res.status(200).render('myOrders', {
    title: 'My Orders',
    orders,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const allProducts = await Product.find({});

  res.status(200).render('products', {
    title: 'products',
    allProducts: allProducts,
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true, runValidators: true }
//   );

//   res
//     .status(200)
//     .render('account', { title: 'Your account', user: updatedUser });
// });
