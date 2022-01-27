const Product = require('../models/productModel');
const User = require('../models/userModel');
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
  //1) Get Featured Product data from collection
  const products = await Product.find({
    isFeatured: true,
    isAvailable: true,
  }).limit(14);

  const cartQty = cartController.checkQtyInCart(req, res);

  // 2)  Build and render template using data from step 1)
  res.status(200).render('index', {
    products: products,
    // user: res.user,
    isFrontPage: true,
    cartQty,
  });
});

exports.getShop = catchAsync(async (req, res, next) => {
  //1) Get Featured Product data from collection
  const products = await Product.find({ isAvailable: true });

  const cartQty = cartController.checkQtyInCart(req, res);

  // 2)  Build and render template using data from step 1)
  res.status(200).render('shop', {
    products: products,
    // user: res.user,
    isFrontPage: false,
    cartQty,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  //1) Get the data for the requested product
  const product = await Product.findOne({ slug: req.params.slug });
  const products = await Product.find({
    isFeatured: true,
    isAvailable: true,
  }).limit(7);
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

  // 2)  Build and render template using data from step 1)

  res.status(200).render('product', {
    title: `${product.name}`,
    product: product,
    products: products,
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

  res.status(200).render('login', {
    title: 'Login',
    //  user: res.user,
    cartQty,
  });
};

exports.getSignupForm = (req, res) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // res.setHeader(
  //   'Content-Security-Policy',
  //   "script-src 'self' cdn.jsdelivr.net  blob: data: gap:"
  // );
  const region = User.schema.path('address.region').enumValues;
  const district = User.schema.path('address.dcDistrict').enumValues;
  res.status(200).render('signup', {
    title: 'Signup',
    region: region,
    district: district,
    // user: res.user,
    cartQty,
  });
};

exports.getAccount = (req, res) => {
  const cartQty = cartController.checkQtyInCart(req, res);
  const region = User.schema.path('address.region').enumValues;
  const district = User.schema.path('address.dcDistrict').enumValues;
  res.status(200).render('account', {
    title: 'Your account',
    cartQty,
    region,
    district,
  });
};

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find orders that belong to user
  const orders = await Order.find({ user: req.user.id });

  res.status(200).render('myOrders', {
    title: 'My Orders',
    orders,
    cartQty,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all products
  const allProducts = await Product.find({});

  // 2)  Build and render template using data from step 1)

  res.status(200).render('products', {
    title: 'products',
    allProducts: allProducts,
    cartQty,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all orders
  const allOrders = await Order.find({}).populate('user');

  res.status(200).render('allOrders', {
    title: 'orders',
    orders: allOrders,
    cartQty,
  });
});

exports.getAdminSettings = catchAsync(async (req, res, next) => {
  const cartQty = cartController.checkQtyInCart(req, res);

  // 1) Find all settings
  const settings = await Config.find({});

  res.status(200).render('adminSettings', {
    title: 'Admin Settings',
    settings: settings[0],
    cartQty,
  });
});

exports.getCheckout = catchAsync(async (req, res) => {
  const cartQty = cartController.checkQtyInCart(req, res);
  const region = User.schema.path('address.region').enumValues;
  const district = User.schema.path('address.dcDistrict').enumValues;

  const sess = req.session;
  const cart = typeof sess.cart !== 'undefined' ? sess.cart : false;
  res.render('checkout', {
    pageTitle: 'Checkout',
    cart: cart,
    region: region,
    district: district,
    nonce: Security.md5(req.sessionID + req.headers['user-agent']),
    // user: res.user,
    cartQty,
  });
});
