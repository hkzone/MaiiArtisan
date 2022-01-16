import { login, logout, signup } from './login';
import updateSettings from './updateSettings';

const accountHandler = () => {
  // DOM ELEMENTS
  const loginForm = document.querySelector('.form-signin');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const signupForm = document.querySelector('.signup-form');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');

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

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
          document.getElementById('passwordConfirm').value;
        const unit = document.getElementById('unit').value;
        const floorNo = document.getElementById('floorNo').value;
        const blockNo = document.getElementById('blockNo').value;
        const buildingName = document.getElementById('buildingName').value;
        const estateOrVillageName = document.getElementById(
          'estateOrVillageName'
        ).value;
        const buildingNo = document.getElementById('buildingNo').value;
        const streetName = document.getElementById('streetName').value;
        const district = document.getElementById('district').value;
        const region = document.getElementById('region').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

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
      document.querySelector('.btn--save-password').textContent = 'Updating...';

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
};

export default accountHandler;
