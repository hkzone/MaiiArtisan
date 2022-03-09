/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { showAlert } from './alerts';
import orderTable from './components/_orderTable';

export const updateProduct = async (_id, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/products/${_id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated product successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateOrder = async (_id, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/orders/${_id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated order successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const filterOrders = async (_id, data) => {
//   try {
//     const { dueDate, isReady, isDelivered } = data;
//     const res = await axios({
//       method: 'POST',
//       url: `/api/v1/orders/${_id}:${isReady}:${isDelivered}`,
//       data,
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Updated order successfully!');
//       window.setTimeout(() => {
//         location.reload(true);
//       }, 2000);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

export const getOrders = async (data = '') => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/orders/${data}`,
      data,
    });

    if (res.data.status === 'success') {
      const adminOrderTable = document.querySelector('.edit-orders');

      adminOrderTable.innerHTML = orderTable(res.data.data.data);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateAdminSettings = async (_id, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/settings/${_id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated settings successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
