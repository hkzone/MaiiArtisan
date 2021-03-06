/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        if (location.pathname === '/checkout') location.reload();
        else location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      if (location.pathname === '/checkout') location.reload();
      else location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again later');
  }
};

export const signup = async (
  name,
  email,
  password,
  passwordConfirm,
  unit,
  floorNo,
  blockNo,
  buildingName,
  estateOrVillageName,
  buildingNo,
  streetName,
  district,
  region,
  phoneNumber
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        unit,
        floorNo,
        blockNo,
        buildingName,
        estateOrVillageName,
        buildingNo,
        streetName,
        district,
        region,
        phoneNumber,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        if (location.pathname === '/checkout') location.reload();
        else location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
