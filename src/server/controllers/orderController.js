const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/userModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Security = require('../utils/security');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Check if there's a valid session
  if (Security.isValidNonce(req.body.nonce, req)) {
    const cart = req.session.cart ? req.session.cart : null;

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      success_url: `${req.protocol}://${req.get('host')}/my-orders?alert=order`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,
      customer_email: req.user.email,
      client_reference_id: req.params.Id,
      mode: 'payment',
      metadata: { dueDate: req.body.dueDate },
      line_items: cart.items.map((el) => ({
        price_data: {
          product_data: {
            name: el.name,
            description: `${el.color ? `Color:   ${el.color}, ` : ''} ${
              el.flavor ? ` Flavor: ${el.flavor}, ` : ''
            }${el.option ? ` Option: ${el.option}, ` : ''} ${
              el.message ? `Message: ${el.message}, ` : ''
            }`,
            images: [
              `${req.protocol}://${req.get('host')}/images/products/${
                el.imageCover
              }`,
            ],
            metadata: {
              id: el._id.toString(),
              customColor: el.color,
              customFlavor: el.flavor,
              customMessage: el.message,
            },
          },
          unit_amount: el.price * 100,
          currency: process.env.LOCALE_CURRENCY,
        },
        quantity: el.qty,
      })),
    });

    // 3) Create session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  } else {
    res.redirect('/');
  }
});

//TODO: COMMENT OUT  AFTER DEPLOYMENT
// exports.createOrderCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make orders without paying
//   const { product, user, price } = req.query;

//   if (!product && !user && !price) return next();
//   await Order.create({ product, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

//TODO: CHANGE TO THIS AFTER DEPLOYMENT
const createOrderCheckout = async (session) => {
  const expandedData = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  });
  const isPaid = true;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const totalAmount = session.amount_total / 100;
  const { dueDate } = session.metadata;
  const orderItems = expandedData.line_items.data.map((el) => ({
    product: el.price.product.metadata.id,
    qty: el.quantity,
    customColor: el.price.product.metadata.customColor,
    customFlavor: el.price.product.metadata.customFlavor,
    customMessage: el.price.product.metadata.customMessage,
  }));

  await Order.create({ user, orderItems, totalAmount, dueDate, isPaid });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed')
    createOrderCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
