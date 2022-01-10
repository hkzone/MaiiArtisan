const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Security = require('../utils/security');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the
  // if (Security.isValidNonce(req.body.nonce, req)) {
  const cart = req.session.cart ? req.session.cart : null;

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-orders?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.Id,
    mode: 'payment',
    line_items: cart.items.map((el) => ({
      price_data: {
        // product: el.id,
        product_data: {
          name: el.name,
          description: `${el.color ? `Color:   ${el.color}, ` : ''} ${
            el.flavor ? ` Flavor: ${el.flavor}, ` : ''
          }${el.option ? ` Option: ${el.option}, ` : ''} ${
            el.message ? `Message: ${el.message}, ` : ''
          }`,
          //TODO: remove comments once hosted
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
  // } else {
  //   res.redirect('/');
  // }
});

//TODO: COMMENT OUT  AFTER DEPLOYMENT
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

//TODO: CHANGE TO THIS AFTER DEPLOYMENT
const createBookingCheckout = async (session) => {
  // const { lineItems } = await stripe.checkout.sessions.retrieve(session.id, {
  //   expand: ['line_items.data.price.product'],
  // });
  console.log(
    '@@@@@',
    await stripe.checkout.sessions.listLineItems(session.id)
  );

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    .data;

  console.log('lineItems', lineItems);

  const user = (await User.findOne({ email: session.customer_email })).id;
  const totalAmount = session.amount_total / 100;
  const orderItems = lineItems.data.map((el) => ({
    product: el.price.product.metadata.id,
    qty: el.quantity,
    customColor: el.price.product.metadata.customColor,
    customFlavor: el.price.product.metadata.customFlavor,
    customMessage: el.price.product.metadata.customMessage,
  }));

  await Booking.create({ user, orderItems, totalAmount });
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

  console.log('event.data.object', event.data.object);
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
