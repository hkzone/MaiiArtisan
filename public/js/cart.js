import axios from 'axios';

import { showAlert } from './alerts';

export const updateCart = async (quantitiesAndIds, nonce) => {
  // try {
  //   const res =
  await axios({
    method: 'POST',
    url: '/cart/update',
    data: {
      quantitiesAndIds,
      nonce,
    },
  });

  //   if (res.data.status === 'success') {
  //     showAlert('success', 'Updated successfully!');
  //     window.setTimeout(() => {
  //       location.assign('/cart');
  //     }, 1500);
  //   }
  // } catch (err) {
  //   showAlert('error', err.response.data.message);
  // }
};
