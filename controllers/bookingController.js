const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Security = require('../utils/security');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the
  // if (Security.isValidNonce(req.body.nonce, req)) {
  const cart = req.session.cart ? req.session.cart : null;

  console.log(
    `${req.protocol}://${req.get('host')}/images/products/${
      cart.items[0].imageCover
    }`
  );

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

    line_items: cart.items.map((el) => ({
      name: el.name,
      description: `Color: "${el.color ? el.color : 'original'}"  Flavor: "${
        el.flavor ? el.flavor : 'original'
      }"  /n Option: "${el.option ? el.option : 'n/a'}"  Message: "${
        el.message ? el.message : 'n/a'
      }"`,
      //TODO: remove comments once hosted
      // images: [
      //   `${req.protocol}://${req.get('host')}/images/products/${el.imageCover}`,
      // ],
      amount: el.price * 100,
      currency: process.env.LOCALE_CURRENCY,
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
  console.log('session=', session.line_items);
  stripe.checkout.sessions.listLineItems(session.id);
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
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

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
