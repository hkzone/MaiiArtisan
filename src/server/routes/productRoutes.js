const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
// const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', productController.checkID);

// router.use('/:productId/reviews', reviewRouter);

// router
//   .route('/top-5-cheap')
//   .get(productController.aliasTopProducts, productController.getAllProducts);

// router.route('/product-stats').get(productController.getProductStats);
// router
//   .route('/monthly-plan/:year')
//   .get(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide', 'guide'),
//     productController.getMonthlyPlan
//   );

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.createProduct
  );

router
  .route('/:id')
  // .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    productController.deleteProduct
  );

module.exports = router;
