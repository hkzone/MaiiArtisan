import axios from 'axios';
import { showAlert } from './alerts';

export const contactUs = async (name, surname, email, url, message) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/contactus',
      data: {
        name,
        surname,
        email,
        url,
        message,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your message was received successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
