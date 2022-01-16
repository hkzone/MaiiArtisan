/* eslint-disable node/no-unpublished-import */
import '@babel/polyfill';

import accountHandler from './account';
import cartHandler from './cart';
import adminHandler from './admin';
import { shopHandler } from './shop';
import app from './app';

import '../styles/main.scss';
import '../../../../node_modules/smart-webcomponents/source/modules/smart.listbox.js';
import '../../../../node_modules/smart-webcomponents/source/modules/smart.input.js';
import '../../../../node_modules/smart-webcomponents/source/styles/smart.default.css';

//Call app function on DOMContentLoaded event
window.addEventListener('DOMContentLoaded', () => {
  app();
  accountHandler();
  cartHandler();
  adminHandler();
  shopHandler();
});
