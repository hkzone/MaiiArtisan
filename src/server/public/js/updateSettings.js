/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
const updateSettings = async (data, type, method = 'PATCH') => {
  try {
    let url;
    if (type === 'password') url = '/api/v1/users/updateMyPassword';
    else if (type === 'data') url = '/api/v1/users/updateMe';
    else if (type === 'address') url = '/api/v1/users/updateMyAddress';

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default updateSettings;
