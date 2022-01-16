const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

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

router.get(
  '/my-orders',

  authController.protect,
  viewController.getMyOrders
);

router.get(
  '/products',

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

router.get(
  '/admin-settings',

  authController.protect,
  authController.restrictTo('admin'),
  viewController.getAdminSettings
);

module.exports = router;
