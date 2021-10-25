const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
// const AppError = require('../utils/appError');
const Security = require('../utils/security');

exports.getCart = (req, res) => {
  const sess = req.session;
  const cart = typeof sess.cart !== 'undefined' ? sess.cart : false;
  //  console.log(cart);
  res.render('cart', {
    pageTitle: 'Cart',
    cart: cart,
    nonce: Security.md5(req.sessionID + req.headers['user-agent']),
  });
};

//TODO: Change to async

exports.addToCart = (req, res) => {
  const product = req.body.product_id;
  if (req.body.qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Product.findOne({ _id: product })
      .then((prod) => {
        const cart = req.session.cart ? req.session.cart : null;
        Cart.addToCart(prod, req.body, cart);
        res.redirect('/cart');
      })
      .catch((err) => {
        res.redirect('/');
      });
  } else {
    res.redirect('/');
  }
};

exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  // console.log(id);
  if (Security.isValidNonce(req.params.nonce, req)) {
    Cart.removeFromCart(id, req.session.cart);
    res.redirect('/cart');
  } else {
    res.redirect('/');
  }
};

exports.emptyCart = (req, res) => {
  if (Security.isValidNonce(req.params.nonce, req)) {
    Cart.emptyCart(req);
    res.redirect('/cart');
  } else {
    res.redirect('/');
  }
};

exports.updateCart = (req, res) => {
  if (Security.isValidNonce(req.body.nonce, req)) {
    console.log('ok...');
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
};
