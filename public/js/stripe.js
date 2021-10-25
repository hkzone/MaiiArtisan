/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'sk_test_51J69McLJWUFHJnVSVAjEhgzcU4I6gTkdMIVsBFtN93t2MZRu3UGAu5yhJHzBitTN8LKtMaeW4RNGvMfXTMXSmeiz00hYWthhhi'
);

export const checkoutCart = async (nonce) => {
  try {
    // 1) Get checkout session from API

    const session = await axios({
      method: 'GET',
      url: '/api/v1/bookings/checkout-session',
      data: {
        nonce,
      },
    });
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
