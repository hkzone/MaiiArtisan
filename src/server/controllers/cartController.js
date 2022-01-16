const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
// const AppError = require('../utils/appError');
const Security = require('../utils/security');
const catchAsync = require('../utils/catchAsync');

// ************************************************************************** //
// ************ Check total q-ty of items in the cart (for menu) ************ //
// ************************************************************************** //
exports.checkQtyInCart = (req, res) => {
  const sess = req.session;
  const cart = typeof sess.cart !== 'undefined' ? sess.cart : false;

  if (cart && cart.items.length > 0) {
    return cart.items.map((el) => parseInt(el.qty, 10)).reduce((a, b) => a + b);
  }
  return 0;
};

// ************************************************************************** //
// ******************************* Render Cart ****************************** //
// ************************************************************************** //
exports.getCart = catchAsync(async (req, res) => {
  const sess = req.session;
  const cart = typeof sess.cart !== 'undefined' ? sess.cart : false;
  res.render('cart', {
    pageTitle: 'Cart',
    cart: cart,
    nonce: Security.md5(req.sessionID + req.headers['user-agent']),
    // user: res.user,
    cartQty: this.checkQtyInCart(req, res),
  });
});

// ************************************************************************** //
// ************************** Add items to the cart ************************* //
// ************************************************************************** //
exports.addToCart = catchAsync(async (req, res) => {
  const product = req.body.product_id;
  if (req.body.qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Product.findOne({ _id: product })
      .then((prod) => {
        const cart = req.session.cart ? req.session.cart : null;
        Cart.addToCart(prod, req.body, cart);
        res.redirect('/cart');
      })
      .catch(() => {
        res.redirect('/');
      });
  } else {
    res.redirect('/');
  }
});

// ************************************************************************** //
// ************************ Remove item from the cart *********************** //
// ************************************************************************** //
exports.removeFromCart = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (Security.isValidNonce(req.params.nonce, req)) {
    Cart.removeFromCart(id, req.session.cart);
    res.redirect('/cart');
  } else {
    res.redirect('/');
  }
});

// ************************************************************************** //
// ***************************** Empty the cart ***************************** //
// ************************************************************************** //
exports.emptyCart = catchAsync(async (req, res) => {
  if (Security.isValidNonce(req.params.nonce, req)) {
    Cart.emptyCart(req);
    res.redirect('/cart');
  } else {
    res.redirect('/');
  }
});

// ************************************************************************** //
// ******************************* Update cart ****************************** //
// ************************************************************************** //
exports.updateCart = catchAsync(async (req, res) => {
  if (Security.isValidNonce(req.body.nonce, req)) {
    const { quantitiesAndIds } = req.body;
    const cart = req.session.cart ? req.session.cart : null;
    const qId = !Array.isArray(quantitiesAndIds)
      ? [quantitiesAndIds]
      : quantitiesAndIds;

    Cart.updateCart(qId, cart);

    //FIXME:DOUBLE SEND RESPONCE (also in cart js)
    res.status(204).redirect('/cart');
  } else {
    res.status(403).redirect('/');
  }
});
