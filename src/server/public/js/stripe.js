/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51J69McLJWUFHJnVSrgJ6QIdRoxJTLxAE5YSAUztis2OCSRNWrqqWyp6BuLYPnTpq3Wn0xyHhxEO8NLakiGkk0mSA00yKoWcotW'
);

export const checkoutCart = async (nonce) => {
  try {
    // 1) Get checkout session from API

    const session = await axios({
      method: 'GET',
      url: '/api/v1/orders/checkout-session',
      data: {
        nonce,
      },
    });

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
