import axios from 'axios';
import checkoutCart from './stripe.js';

import { showAlert } from './alerts';

const updateCart = async (quantitiesAndIds, nonce) => {
  try {
    await axios({
      method: 'POST',
      url: '/cart/update',
      data: {
        quantitiesAndIds,
        nonce,
      },
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const cartHandler = () => {
  // DOM ELEMENTS
  const cart = document.querySelector('.cart-wrapper');
  const cartUpdateForm = document.querySelector('.cart__update');
  const chekoutBtn = document.querySelector('.chekoutBtn');

  if (cart) {
    // ************** Sets then min and max dates for order delivery ************ //
    $(() => {
      $('[type="date"]#due-date')
        .prop('min', () => {
          const future = new Date();
          future.setDate(future.getDate() + 1);
          return future.toJSON().split('T')[0];
        })
        .prop('max', () => {
          const future = new Date();
          future.setDate(future.getDate() + 30);
          return future.toJSON().split('T')[0];
        })
        .prop('value', () => {
          const future = new Date();
          future.setDate(future.getDate() + 2);
          return future.toJSON().split('T')[0];
        });
    });

    // ******************************* Update cart ****************************** //
    cartUpdateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const quantitiesAndIds = $('.qty')
        .map(function () {
          return {
            qty: parseInt($(this).val(), 10),
            product_id: $(this).data('productid'),
          };
        })
        .toArray();
      updateCart(quantitiesAndIds, $('.nonce').attr('value'));
    });

    // ****************************** Checkout Cart ***************************** //
    chekoutBtn.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      checkoutCart($('.nonce').attr('value'), $('#due-date').val());
    });
  }
};

export default cartHandler;
