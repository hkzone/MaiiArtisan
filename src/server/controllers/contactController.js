const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

exports.contactUs = catchAsync(async (req, res, next) => {
  const newMessage = {
    name: `${req.body.name} ${req.body.surname}`,
    email: process.env.EMAIL_FROM,
    url: req.body.url,
    message: req.body.message,
    contactEmail: req.body.email,
  };
  await new Email(newMessage, newMessage.url).sendContactUs();
  res.status(200).json({ status: 'success' });
});
