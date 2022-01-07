import '@babel/polyfill';
import { login, logout, signup } from './login';
import { contactUs } from './contactUs';
import { updateCart } from './cart';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
import * as PIXI from 'pixi.js';
import { install } from '@pixi/unsafe-eval';
import { render3dImage } from './3dimage.js';
import { checkoutCart } from './stripe.js';
import { updateProduct } from './admin.js';

import './../styles/main.scss';

// Colaplse navBar after use
// const navLinks = document.querySelectorAll('.nav-item');
// const menuToggle = document.getElementById('navbarSupportedContent');
// const bsCollapse = new bootstrap.Collapse(menuToggle);
// navLinks.forEach((l) => {
//   l.addEventListener('click', () => {
//     bsCollapse.toggle();
//   });
// });

// DOM ELEMENTS
//const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-signin');
const signupForm = document.querySelector('.signup-form');
const contactForm = document.querySelector('#contact-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const image3d = document.querySelector('.image3d');
const btnQuantity = document.querySelector('.btn-number');

const cartUpdateForm = document.querySelector('.cart__update');
const chekoutBtn = document.querySelector('.chekoutBtn');
const productsTable = document.querySelector('.products-table');
const btnProductUpdateSubmit = document.querySelector(
  '#btnProductUpdateSubmit'
);
if (image3d) {
  // Apply the patch to PIXI
  install(PIXI);

  // Create the renderer with patch applied
  const renderer = new PIXI.Renderer();

  render3dImage(
    '.image3d',
    './../images/image.jpg',
    './../images/image_depth.jpg',
    PIXI
  );
}

// fetch all the forms we want to apply custom style
const inputs = document.getElementsByClassName('form-control');

// loop over each input and watch blur event
const validation = Array.prototype.filter.call(inputs, function (input) {
  input.addEventListener(
    'blur',
    function (event) {
      // reset
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');

      if (input.checkValidity() === false) {
        input.classList.add('is-invalid');
      } else {
        input.classList.add('is-valid');
      }
    },
    false
  );
});

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.getElementsByClassName('needs-validation');
// Loop over them and prevent submission
const validation2 = Array.prototype.filter.call(forms, function (form) {
  form.addEventListener('submit', (event) => {
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    form.classList.add('was-validated');
  });
});
// //Contact Form
// const contactForm = document.getElementById('contact-form');
// if (contactForm) validateForm(contactForm);

//const bookBtn = document.getElementById('book-tour');

// DELEGATION
// if (mapBox) {
//   const locations = JSON.parse(mapBox.dataset.locations);
//   displayMap(locations);
// }

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    //  console.log( document.getElementById('name').value,document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

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

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (contactForm)
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const url = document.getElementById('url').value;
    const message = document.getElementById('message').value;
    contactUs(name, surname, email, url, message);
  });

if (signupForm)
  signupForm.addEventListener(
    'submit',
    (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
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

      signup(
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
    },
    false
  );

// if (bookBtn)
//   bookBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'Processing...';
//     const { tourId } = e.target.dataset;
//     bookTour(tourId);
//   });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

if (btnQuantity) {
  // -----------IMAGE SLIDER-------------------------------
  let thumbnails = document.getElementsByClassName('product-thumbnail');

  let activeImages = document.getElementsByClassName('product-active');

  for (let i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('mouseover', function () {
      if (activeImages.length > 0) {
        activeImages[0].classList.remove('product-active');
      }

      this.classList.add('product-active');
      document.getElementById('product-featured').src = this.src;
    });
  }

  let buttonRight = document.getElementById('product-slideRight');
  let buttonLeft = document.getElementById('product-slideLeft');

  buttonLeft.addEventListener('click', function () {
    document.getElementById('product-slider').scrollLeft -= 180;
  });

  buttonRight.addEventListener('click', function () {
    document.getElementById('product-slider').scrollLeft += 180;
  });

  //plugin bootstrap minus and plus
  //http://jsfiddle.net/laelitenetwork/puJ6G/

  $('.btn-number').click(function (e) {
    e.preventDefault();
    const fieldName = $(this).data('field');
    const type = $(this).data('type');
    const input = $("input[name='" + fieldName + "']");
    const incrementDecrement = parseInt(input.data('increaseby'));
    const currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
      if (type == 'minus') {
        if (currentVal > input.attr('min')) {
          input.val(currentVal - incrementDecrement).change();
        }
        if (parseInt(input.val()) == input.attr('min')) {
          $(this).attr('disabled', true);
        }
      } else if (type == 'plus') {
        if (currentVal < input.attr('max')) {
          input.val(currentVal + incrementDecrement).change();
        }
        if (parseInt(input.val()) == input.attr('max')) {
          $(this).attr('disabled', true);
        }
      }
    } else {
      input.val(0);
    }
  });
  $('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
  });
  $('.input-number').change(function () {
    const minValue = parseInt($(this).attr('min'));
    const maxValue = parseInt($(this).attr('max'));
    const valueCurrent = parseInt($(this).val());

    const name = $(this).attr('name');
    if (valueCurrent >= minValue) {
      $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr(
        'disabled'
      );
    } else {
      alert('Sorry, the minimum value was reached');
      $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
      $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr(
        'disabled'
      );
    } else {
      alert('Sorry, the maximum value was reached');
      $(this).val($(this).data('oldValue'));
    }
  });

  //Set current min and max date values
  $(function () {
    $('[type="date"]#date')
      .prop('min', function () {
        let future = new Date();
        future.setDate(future.getDate() + 1);
        return future.toJSON().split('T')[0];
      })
      .prop('max', function () {
        let future = new Date();
        future.setDate(future.getDate() + 30);
        return future.toJSON().split('T')[0];
      })
      .prop('value', function () {
        let future = new Date();
        future.setDate(future.getDate() + 2);
        return future.toJSON().split('T')[0];
      });
  });
}
// Update cart
if (cartUpdateForm)
  cartUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const quantitiesAndIds = $('.qty')
      .map(function () {
        return {
          qty: parseInt($(this).val()),
          product_id: $(this).data('productid'),
        };
      })
      .toArray();
    updateCart(quantitiesAndIds, $('.nonce').attr('value'));
  });

//CHECKOUT CART
if (chekoutBtn)
  chekoutBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    // const { tourId } = e.target.dataset;
    checkoutCart($('.nonce').attr('value'));
  });

//Edit Product
if (productsTable) {
  //File upload styling
  const inputs = document.querySelectorAll('.inputfile');
  inputs.forEach((input) => {
    const label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
      let fileName = '';
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace(
          'count',
          this.files.length
        );
      else fileName = e.target.value.split('\\').pop();

      if (fileName) label.querySelector('span').innerHTML = fileName;
      else label.innerHTML = labelVal;
    });
  });

  //product edit functionality
  productsTable.addEventListener('click', (e) => {
    const editProductBtn = e.target.classList.contains('editProductBtn');
    if (!editProductBtn) {
      return;
    }
    const product = JSON.parse(e.target.dataset.field);
    const keys = Object.keys(product).map((key) => key);

    keys.forEach((key) => {
      if ($(`input[name='${key}']`).is(':checkbox')) {
        $(`input[name='${key}']`).attr('checked', product[key]);
      } else if (key === 'imageCover') {
        $('.imageCover').attr('src', `/images/products/${product[key]}`);
      } else if (key === 'images') {
        console.log('imnages+++', product[key]);
        product[key].forEach((el, index) => {
          $(`.photo-images${index}`).attr('src', `/images/products/${el}`);
        });
      } else {
        $(`[name='${key}']`).val(product[key]);
        $(`[name='${key}']`).attr('data-field', product[key]);
      }

      $(`[name='${key}']`).attr('data-field', product[key]);
    });

    $('#editProductModal').modal('show');
    // const { tourId } = e.target.dataset;
  });
}
//Update Product
if (btnProductUpdateSubmit)
  btnProductUpdateSubmit.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    // let updatedProduct = {};
    const form = new FormData();
    $('input, .txtArea')
      .not(':input[type=button], :input[type=submit], :input[type=reset]')
      .each(function () {
        const keyValue = $(this).attr('name');
        let value;
        if ($(this).is(':checkbox')) {
          value = $(this).is(':checked');
        } else value = $(this).val();

        // updatedProduct = { ...updatedProduct, ...{ [keyValue]: value } };
        if (value.toString() !== $(this).attr('data-field')) {
          if ($(this).is(':file')) {
            if ($(this).get(0).files.length !== 0) {
              for (let i = 0; i < $(this).get(0).files.length || i < 3; i++) {
                form.append(`${keyValue}`, $(this).get(0).files[i]);
              }
            }
          } else form.append(`${keyValue}`, value);
        }
      });

    // //1) Cover image
    // const imageCoverFiles =
    //   document.getElementById('photo-imageCover').files[0];
    // if (imageCoverFiles !== undefined) {
    //   form.append('imageCover', imageCoverFiles);
    // }

    // //2)Images
    // const imagesFiles = document.getElementById('photo-images').files;
    // if (imagesFiles !== undefined) {
    //   for (let i = 0; i < imagesFiles.length || i < 3; i++) {
    //     form.append('images', imagesFiles[i]);
    //   }
    // }

    updateProduct($(`input[name='_id']`).val(), form);
  });
