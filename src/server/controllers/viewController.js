const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Config = require('../models/configModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Security = require('../utils/security');
const cartController = require('./cartController');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'order')
    res.locals.alert =
      "Your order was successful! Please check your email for a confirmation. If your order doesn't show up here immediatly, please come back later.";
  next();
};

exports.getIndex = catchAsync(async (req, res, next) => {
  //1) Get Feaured Product data from collection
  const products = await Product.find({
    isFeatured: true,
    isAvailable: true,
  }).limit(14);
  console.log('isLoggedIn');

  const cartQty = cartController.checkQtyInCart(req, res);

  //2) Build template
  //3) Render that template using data from step 1
  //3) Render  template

  res.status(200).render('index', {
    products: products,
    user: res.user,
    isFrontPage: true,
    cartQty,
  });
});

exports.getShop = catchAsync(async (req, res, next) => {
  //1) Get Feaured Product data from collection
  const products = await Product.find({ isAvailable: true });
  console.log('isLoggedIn');

  const cartQty = cartController.checkQtyInCart(req, res);

  //2) Build template
  //3) Render that template using data from step 1
  //3) Render  template

  res.status(200).render('shop', {
    products: products,
    user: res.user,
    isFrontPage: false,
    cartQty,
  });
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

  const cartQty = cartController.checkQtyInCart(req, res);

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
    cartQty,
  });
});

exports.getLoginForm = (req, res) => {
  // res.setHeader(
  //   'Content-Security-Policy',
  //   "script-src 'self' cdn.jsdelivr.net  blob: data: gap:"
  // );
  const cartQty = cartController.checkQtyInCart(req, res);

  res.status(200).render('login', { title: 'Login', user: res.user, cartQty });
};
exports.getSignupForm = (req, res) => {
  const cartQty = cartController.checkQtyInCart(req, res);

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
    cartQty,
  });
};

exports.getAccount = (req, res) => {
  const cartQty = cartController.checkQtyInCart(req, res);
  res.status(200).render('account', { title: 'Your account', cartQty });
};

exports.getMyProducts = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all orders
  const orders = await Order.find({ user: req.user.id });
  console.log(orders);

  // 2) Find products with the returned IDs
  //const productIDs = orders.map((el) => el.product);
  //const products = await Product.find({ _id: { $in: productIDs } });

  res.status(200).render('myOrders', {
    title: 'My Orders',
    orders,
    cartQty,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all orders
  const allProducts = await Product.find({});

  res.status(200).render('products', {
    title: 'products',
    allProducts: allProducts,
    cartQty,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all orders
  const allOrders = await Order.find({});

  res.status(200).render('allOrders', {
    title: 'orders',
    orders: allOrders,
    cartQty,
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
