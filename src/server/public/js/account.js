import { login, logout, signup } from './login';
import updateSettings from './updateSettings';

export const updateAddress = (form) => {
  const _id = form.querySelector('#_id');
  const contactPerson = form.querySelector('#contactPerson').value;
  const unit = form.querySelector('#unit').value;
  const floorNo = form.querySelector('#floorNo').value;
  const blockNo = form.querySelector('#blockNo').value;
  const buildingName = form.querySelector('#buildingName').value;
  const estateOrVillageName = form.querySelector('#estateOrVillageName').value;
  const buildingNoFrom = form.querySelector('#buildingNoFrom').value;
  const streetName = form.querySelector('#streetName').value;
  const dcDistrict = form.querySelector('#dcDistrict').value;
  const region = form.querySelector('#region').value;
  const contactPhoneNo = form.querySelector('#contactPhoneNo').value;
  const address = {
    contactPerson,
    unit,
    floorNo,
    blockNo,
    buildingName,
    estateOrVillageName,
    buildingNoFrom,
    streetName,
    dcDistrict,
    region,
    contactPhoneNo,
  };

  //if we edit existing address add id
  if (_id && _id.value) address._id = _id.value;

  console.log(address);

  updateSettings({ address: address }, 'address', form.dataset.type);
};

export const accountHandler = () => {
  // DOM ELEMENTS
  const loginForm = document.querySelector('.form-signin');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const signupForm = document.querySelector('.signup-form');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  const addressBook = document.querySelector('.address-book');

  // ********************************** LOGIN ********************************* //
  if (loginForm)
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });

  // ********************************* LOGOUT ********************************* //
  if (logOutBtn) logOutBtn.addEventListener('click', logout);

  // ********************************* SIGNUP ********************************* //
  if (signupForm)
    signupForm.addEventListener(
      'submit',
      async (e) => {
        e.preventDefault();
        const button = signupForm.querySelector('[type = "submit"]');
        const buttonInnerText = button.innerText;
        button.innerText = 'Processing...';
        button.disabled = true;

        const name = signupForm.querySelector('#signup-name').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;
        const passwordConfirm = signupForm.querySelector(
          '#signup-passwordConfirm'
        ).value;
        const unit = signupForm.querySelector('#unit').value;
        const floorNo = signupForm.querySelector('#floorNo').value;
        const blockNo = signupForm.querySelector('#blockNo').value;
        const buildingName = signupForm.querySelector('#buildingName').value;
        const estateOrVillageName = signupForm.querySelector(
          '#estateOrVillageName'
        ).value;
        const buildingNo = signupForm.querySelector('#buildingNoFrom').value;
        const streetName = signupForm.querySelector('#streetName').value;
        const district = signupForm.querySelector('#dcDistrict').value;
        const region = signupForm.querySelector('#region').value;
        const phoneNumber = signupForm.querySelector('#phoneNumber').value;
        await signup(
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
        );
        button.innerText = buttonInnerText;
        button.disabled = false;
      },
      false
    );

  // ********************** USER SELF UPDATE INFORMATION ********************** //
  if (userDataForm)
    userDataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);

      updateSettings(form, 'data');
    });

  // ************************ USER SELF UPDATE PASSWORD *********************** //
  if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn-save-password').textContent = 'Updating...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );

      document.querySelector('.btn--save-password').textContent =
        'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });

  // *********************** Update/Delete/Add Addresses ********************** //
  if (addressBook) {
    const userAddressForm = document.querySelector('.form-user-address');
    addressBook.addEventListener('click', (e) => {
      //edit address button
      if (e.target.classList.contains('edit-address')) {
        const address = JSON.parse(e.target.dataset.address);
        const keys = Object.keys(address).map((key) => key);
        //empty the form
        $('.form-user-address input').val('');

        $('.form-user-address').css('display', 'block');

        //load in the values
        keys.forEach((key) => {
          $(`[id='${key}']`).val(address[key]);
        });

        userAddressForm.dataset.type = 'patch';

        userAddressForm.scrollIntoView({
          behavior: 'smooth',
        });
      }
      //Delete address button
      if (e.target.classList.contains('delete-address')) {
        updateSettings({ _id: e.target.dataset.id }, 'address', 'delete');
      }

      //add address button
      if (e.target.classList.contains('add-address-button')) {
        $('.form-user-address input').val('');
        $('.form-user-address').css('display', 'block');
        userAddressForm.scrollIntoView({
          behavior: 'smooth',
        });
        userAddressForm.dataset.type = 'post';
      }
    });

    //Update the address
    userAddressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      updateAddress(userAddressForm);
    });
  }
  // **************************** My orders popover *************************** //
  $('[data-toggle=popover]').popover();
  $('.popover-dismiss').popover({
    trigger: 'focus',
  });
};
