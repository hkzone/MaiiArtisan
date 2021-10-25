/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51J69PcJjB2rZY6d0DbnZe3LokXeH3FGQSL4CsWA3yxekT6AdIw6qEmH5zBPnzGqGSf7JOtdntV82trKdwm2K6t2i00mUXf8NTS'
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
