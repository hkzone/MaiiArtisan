import checkoutCart from './stripe.js';
import { logout } from './login';
import { updateAddress } from './account';

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

    const formAddress = document.querySelector('.form-address');
    const dateSection = document.querySelector('.date-section');
    const addressSection = document.querySelector('.address-section');

    if (formAddress) {
      formAddress.addEventListener('submit', (e) => {
        e.preventDefault();
        addressSection.classList.remove('active');
        addressSection.classList.add('non-active');
        dateSection.classList.remove('non-active');
        dateSection.classList.add('active');
      });
    }
    // ****************************** Checkout Cart ***************************** //
    const checkoutForm = document.querySelector('.form-date');
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

    // ***************************** Add new address **************************** //
    const addAddressForm = document.querySelector('.form-user-address');
    if (addAddressForm) {
      addAddressForm.dataset.type = 'post';
      addAddressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('ok');
        updateAddress(addAddressForm);
      });
    }
  }
};

export default checkoutHandler;
