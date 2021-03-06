const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a User!'],
  },

  orderItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Order must belong to a Product!'],
      },
      qty: { type: Number, required: true },
      //TODO:"add weight and size to line items"
      weight: { type: String, required: false },
      size: { type: String, required: false },
      customColor: { type: String, default: '' },
      customFlavor: { type: String, default: '' },
      customMessage: { type: String, default: '' },
      customRequest: { type: String, default: '' },
      unitAmount: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    //   phoneNo: { type: String, required: true },
  },
  // paymentMethod: { type: String, required: true },

  totalAmount: {
    type: Number,
    required: [true, 'order must have a total amount.'],
  },

  dueDate: {
    type: Date,
    required: [true, 'order must have a delivery date.'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isReady: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate('product').populate({
    path: 'orderItems.product',
    select: ['name', 'images', 'imageCover'],
  });

  this.populate('user').populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
