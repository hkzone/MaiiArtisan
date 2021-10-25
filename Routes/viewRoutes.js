const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//router.use(viewController.alerts);

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getIndex);

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
  // bookingController.createBookingCheckout,

  authController.protect,
  viewController.getMyProducts
);

module.exports = router;
