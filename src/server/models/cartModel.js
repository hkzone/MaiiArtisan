class Cart {
  static addToCart(product = null, reqBody, cart) {
    const { weight, qty, color, flavor, date, option, message } = reqBody;

    if (!this.inCart(product._id, cart)) {
      const format = new Intl.NumberFormat(process.env.LOCALE_LANG, {
        style: 'currency',
        currency: process.env.LOCALE_CURRENCY,
      });

      const prod = {
        _id: product._id,
        name: product.name,
        price: product.price,
        qty: qty,
        color: color,
        flavor: flavor,
        date: date,
        option: option,
        message: message,
        weight: weight,
        imageCover: product.imageCover,
        weightUnit: product.weight[0],
        formattedPrice: format.format(product.price),
      };
      cart.items.push(prod);
      this.calculateTotals(cart);
    }
    //TODO:if in cart increase quantity
  }

  static removeFromCart(id = 0, cart) {
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      if (item._id.toString() === id) {
        cart.items.splice(i, 1);
        this.calculateTotals(cart);
      }
    }
  }

  static updateCart(quantitiesAndIds = [], cart) {
    let updated = false;
    quantitiesAndIds.forEach((obj) => {
      cart.items.forEach((item) => {
        if (item._id.toString() === obj.product_id.toString()) {
          if (obj.qty > 0 && obj.qty !== item.qty) {
            item.qty = obj.qty;
            updated = true;
          }
        }
      });
    });
    if (updated) {
      this.calculateTotals(cart);
    }
  }

  static inCart(productID = 0, cart) {
    let found = false;
    cart.items.forEach((item) => {
      if (item._id.toString() === productID.toString()) {
        found = true;
      }
    });
    return found;
  }

  static calculateTotals(cart) {
    cart.totals = 0.0;
    cart.items.forEach((item) => {
      const { price, qty, weight, weightUnit } = item;
      const amount = (price * qty * weight) / weightUnit;

      cart.totals += amount;
    });
    this.setFormattedTotals(cart);
  }

  static emptyCart(request) {
    if (request.session) {
      request.session.cart.items = [];
      request.session.cart.totals = 0.0;
      request.session.cart.formattedTotals = '';
    }
  }

  static setFormattedTotals(cart) {
    const format = new Intl.NumberFormat(process.env.LOCALE_LANG, {
      style: 'currency',
      currency: process.env.LOCALE_CURRENCY,
    });
    const { totals } = cart;
    cart.formattedTotals = format.format(totals);
  }
}

module.exports = Cart;
