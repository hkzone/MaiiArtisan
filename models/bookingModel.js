const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },

  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: String, required: true },
      weight: { type: String, required: true },
      size: { type: String, required: true },
      customColor: { type: String, default: '' },
      customFlavor: { type: String, default: '' },
      customMessage: { type: String, default: '' },
      customRequest: { type: String, default: '' },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Order must belong to a Product!'],
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },

  totalAmount: {
    type: Number,
    require: [true, 'order must have a total amount.'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'product',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
