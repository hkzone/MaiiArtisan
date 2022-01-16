const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.route('/').get(cartController.getCart).post(cartController.addToCart);
router.route('/remove/:id/:nonce').get(cartController.removeFromCart);
router.route('/empty/:nonce').get(cartController.emptyCart);
router.route('/update').post(cartController.updateCart);

module.exports = router;
