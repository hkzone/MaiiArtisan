import {
  updateProduct,
  updateOrder,
  getOrders,
  updateAdminSettings,
} from './adminApiCalls.js';

const adminHandler = () => {
  // DOM ELEMENTS
  const productsTable = document.querySelector('.products-table');
  const btnProductUpdateSubmit = document.querySelector(
    '#btnProductUpdateSubmit'
  );
  const adminSettings = document.querySelector('.admin-settings-container');
  const editOrdersTable = document.querySelector('.admin-orders-table');
  const filterOrders = document.querySelector('#filter-orders');

  // ******* Handle add and delete functionality for smart-list elements ****** //
  const smartItemsHandler = (form) => {
    // "Click" EVENT LISTENER
    form.addEventListener('click', (event) => {
      //click on delete item button
      if (event.target.classList.contains('delete-item')) {
        const listbox =
          event.target.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement;

        const item =
          event.target.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement;

        listbox.removeChild(item);
      }

      //click on add item button
      if (event.target.classList.contains('add-item')) {
        const listbox =
          event.target.parentElement.parentElement.querySelector(
            'smart-list-box'
          );
        const input = event.target.parentElement.querySelector('smart-input');
        listbox.insert(listbox.items.length, input.value);
        console.log('inserting');
        input.value = '';
      }
    });
  };

  // ************************************************************************** //
  // ******************** Display and Change Admin Settings ******************* //
  // ************************************************************************** //
  if (adminSettings) {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('[type = "submit"]');

    smartItemsHandler(form);

    // SUBMIT EVENT LISTENER (save settings)

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      const data = {
        customColors: form
          .querySelector('#listbox-custom-colors')
          .items.map((el) => el.value),
        customFlavor: form
          .querySelector('#listbox-custom-flavor')
          .items.map((el) => el.value),
        specialRequestOptions: form
          .querySelector('#listbox-special-request-options')
          .items.map((el) => el.value),
        customMessageLength: $('#custom-message-length').val(),
      };

      updateAdminSettings(submitButton.dataset.field, data);
    });
  }

  // ************************************************************************** //
  // *********************** EDIT PRODUCTS FUNCTIONALITY ********************** //
  // ************************************************************************** //
  if (productsTable) {
    const form = document.querySelector('form');
    smartItemsHandler(form);
    // ******************************* File upload ****************************** //
    const inputs = document.querySelectorAll('.inputfile');
    inputs.forEach((input) => {
      const label = input.nextElementSibling;
      const labelVal = label.innerHTML;

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

    // ***************** Display Modal with product information ***************** //
    productsTable.addEventListener('click', (e) => {
      //check if edit button was clicked
      const editProductBtn = e.target.classList.contains('edit-product-btn');
      if (!editProductBtn) {
        return;
      }

      const product = JSON.parse(e.target.dataset.field);
      const keys = Object.keys(product).map((key) => key);

      $('.edit-images').attr('src', '');
      $('.edit-images').css('display', 'none');

      keys.forEach((key) => {
        if ($(`input[name='${key}']`).is(':checkbox')) {
          $(`input[name='${key}']`).attr('checked', product[key]);
        } else if (key === 'imageCover') {
          $('.imageCover').attr('src', `/images/products/${product[key]}`);
        } else if (key === 'images') {
          product[key].forEach((el, index) => {
            $(`.photo-images${index}`).attr('src', `/images/products/${el}`);
            $(`.photo-images${index}`).css('display', 'block');
          });
        } else if (key === 'weight' || key === 'ingredients') {
          const listbox = document.querySelector(`#listbox-custom-${key}`);
          if (listbox.items.length > 0) listbox.clearItems();

          product[key].forEach((el) => {
            listbox.insert(listbox.items.length, el);
          });
          $(`[name='${key}']`).attr('data-field', product[key]);
          $(`[name='${key}']`).addClass('listbox');
        } else {
          $(`[name='${key}']`).val(product[key]);
          $(`[name='${key}']`).attr('data-field', product[key]);
        }

        $(`[name='${key}']`).attr('data-field', product[key]);
      });

      $('#editProductModal').modal('show');
    });
  }

  // ***************** SUBMIT EVENT LISTENER (Update Product) ***************** //
  if (btnProductUpdateSubmit)
    btnProductUpdateSubmit.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';

      const form = new FormData();
      $('input, .txtArea smart-list-box')
        .not(':input[type=button], :input[type=submit], :input[type=reset]')
        .each(function () {
          const keyValue = $(this).attr('name');
          let value;
          if ($(this).is(':checkbox')) {
            value = $(this).is(':checked');
          } else if ($(this).hasClass('listbox')) {
            value = document
              .querySelector(`#listbox-custom-${keyValue}`)
              .items.map((el) => el.value);
          } else value = $(this).val();

          if (value.toString() !== $(this).attr('data-field')) {
            if ($(this).is(':file')) {
              if ($(this).get(0).files.length !== 0) {
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < $(this).get(0).files.length || i < 3; i++) {
                  form.append(`${keyValue}`, $(this).get(0).files[i]);
                }
              }
            } else if ($(this).hasClass('listbox')) {
              value.forEach((el) => form.append(`${keyValue}`, el));
            } else {
              form.append(`${keyValue}`, value);
            }
          }
        });

      // .querySelector('#listbox-custom-flavor')
      //   .items.map((el) => el.value)

      updateProduct($(`input[name='_id']`).val(), form);
    });

  // ************************************************************************** //
  // ********************************** Orders ******************************** //
  // ************************************************************************** //
  if (editOrdersTable) {
    // ******************** Mark order as delivered or ready ******************** //
    editOrdersTable.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-order-status-ready')) {
        updateOrder(e.target.dataset.field, { isReady: true });
      } else if (e.target.classList.contains('edit-order-status-delivered')) {
        updateOrder(e.target.dataset.field, { isDelivered: true });
      }
    });

    // ****************************** Filter orders ***************************** //
    filterOrders.addEventListener('click', (e) => {
      e.preventDefault();
      const dueDate = $('#due-date').val();
      let isReady;
      if ($('#is-ready').val() === 'Ready') isReady = true;
      if ($('#is-ready').val() === 'Not ready') isReady = false;

      let isDelivered;
      if ($('#is-delivered').val() === 'Delivered') isDelivered = true;
      if ($('#is-delivered').val() === 'Not delivered') isDelivered = false;

      let isPaid;
      if ($('#is-paid').val() === 'Paid') isPaid = true;
      if ($('#is-paid').val() === 'Unpaid') isPaid = false;

      const query = `?${dueDate !== '' ? `dueDate=${dueDate}&` : ''}${
        typeof isReady === 'boolean' ? `isReady=${isReady}&` : ''
      }${
        typeof isDelivered === 'boolean' ? `isDelivered=${isDelivered}&` : ''
      }${typeof isPaid === 'boolean' ? `isPaid=${isPaid}&` : ''}`;

      getOrders(query);
    });
  }
};

export default adminHandler;
