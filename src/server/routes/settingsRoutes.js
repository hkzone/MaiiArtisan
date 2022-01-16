const express = require('express');

const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    settingsController.updateSettings
  );

module.exports = router;
