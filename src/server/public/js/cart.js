/* eslint-disable no-restricted-globals */
import axios from 'axios';
import checkoutCart from './stripe.js';

import { showAlert } from './alerts';

const updateCart = async (nonce) => {
  try {
    const quantitiesAndIds = $('.qty')
      .map(function () {
        return {
          qty: parseInt($(this).val(), 10),
          product_id: $(this).data('productid'),
        };
      })
      .toArray();

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
  const chekoutBtn = document.querySelector('.chekout-btn');

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
    if (cartUpdateForm) {
      cartUpdateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formButton = cartUpdateForm.querySelector(
          'button[type="submit"]'
        );
        formButton.disabled = true;
        const textPrevious = formButton.innerHTML;
        formButton.innerHTML = 'Processing...';
        await updateCart($('.nonce').attr('value'));
        formButton.innerHTML = textPrevious;
        formButton.disabled = false;
      });

      // ****************************** Checkout Cart ***************************** //
      chekoutBtn.addEventListener('click', async (e) => {
        e.target.disabled = true;
        e.target.textContent = 'Processing...';
        await updateCart($('.nonce').attr('value'));
        location.assign('/checkout');
      });
    }
  }
};

export default cartHandler;
