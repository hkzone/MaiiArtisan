/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-require */
//jshint esversion:6
const path = require('path');
const express = require('express');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Security = require('./utils/security');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const viewRouter = require('./routes/viewRoutes');
const cartRouter = require('./routes/cartRoutes');
const contactRouter = require('./routes/contactRoutes');
const settingsRouter = require('./routes/settingsRoutes');
const orderController = require('./controllers/orderController');

const app = express();

// For HEROKU
app.enable('trust proxy');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ************************************************************************** //
// ************************** 1) GLOBAL MIDDLEWARES ************************* //
// ************************************************************************** //

//Implement CORS
app.use(cors());
app.options('*', cors());
//////// app.options('/api/v1/products/:id', cors());

//Serving static files
app.use(express.static(path.join(__dirname, './public/')));

// Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  orderController.webhookCheckout
);

//Implementing a Basic CSP

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' api.mapbox.com js.stripe.com use.fontawesome.com cdnjs.cloudflare.com cdn.jsdelivr.net code.jquery.com  unsafe-eval blob: data: gap:"
  );
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10KB' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: ['price'],
  })
);

app.use(compression());

//test middleware
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// ************************************************************************** //
// ************************** 2) For shopping cart ************************** //
// ************************************************************************** //
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const store = new MongoDBStore({
  uri: DB,
  collection: process.env.DATABASE_SESSIONS,
});

app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: true,
    unset: 'destroy',
    store: store,
    name: `${process.env.NAME}-${Security.generateId()}`,
    genid: (req) => Security.generateId(),
  })
);

// ************************************************************************** //
// ******************************** 3) ROUTES ******************************* //
// ************************************************************************** //
app.use('/', viewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/orders', orderRouter);
app.use('/cart', cartRouter);
app.use('/contact', contactRouter);
app.use('/settings', settingsRouter);

app.get('/favicon.ico', (req, res) => {
  res.sendFile('/favicon.ico');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find  ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
