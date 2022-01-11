const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

//router.use(viewController.alerts);

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getIndex);

router.get('/shop', authController.isLoggedIn, viewController.getShop);

router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewController.getProduct
);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData
// );

router.get(
  '/my-orders',

  //TODO: COMMENT OUT  AFTER DEPLOYMENT
  // orderController.createOrderCheckout,

  authController.protect,
  viewController.getMyProducts
);

router.get(
  '/products',

  //TODO: COMMENT OUT  AFTER DEPLOYMENT
  // orderController.createOrderCheckout,

  authController.protect,
  authController.restrictTo('admin'),
  viewController.getProducts
);

router.get(
  '/orders',

  authController.protect,
  authController.restrictTo('admin'),
  viewController.getOrders
);

module.exports = router;
