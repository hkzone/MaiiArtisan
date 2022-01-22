import checkoutCart from './stripe.js';
import { logout } from './login';

const checkoutHandler = () => {
  const checkoutWrapper = document.querySelector('.checkout-wrapper');
  if (checkoutWrapper) {
    checkoutWrapper.addEventListener('click', (e) => {
      if (e.target.classList.contains('non-active')) {
        const currentActive = checkoutWrapper.querySelector('section.active');
        currentActive.classList.remove('active');
        currentActive.classList.add('non-active');
        e.target.classList.remove('non-active');
        e.target.classList.add('active');
      }
    });

    const formDate = document.querySelector('.form-date');
    const dateSection = document.querySelector('.date-section');
    const addressSection = document.querySelector('.address-section ');

    if (formDate) {
      formDate.addEventListener('submit', (e) => {
        e.preventDefault();
        dateSection.classList.remove('active');
        dateSection.classList.add('non-active');
        addressSection.classList.remove('non-active');
        addressSection.classList.add('active');
      });
    }
    // ****************************** Checkout Cart ***************************** //
    const checkoutForm = document.querySelector('.form-address');
    if (checkoutForm)
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutForm.querySelector('button[type="submit"]').innerHTML =
          'Processing...';
        checkoutCart(
          $('.nonce').attr('value'),
          $('#due-date').val(),
          $('input[name="customRadio"]:checked').val()
        );
      });

    // ********************************* LOGOUT ********************************* //
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
  }
};

export default checkoutHandler;
