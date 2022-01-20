/* eslint-disable no-unused-vars */

const formHandler = () => {
  // ************************************************************************** //
  // ******************* Validate bootstrap from dynamically ****************** //
  // ************************************************************************** //
  // fetch all the forms we want to apply custom style
  const inputs = document.getElementsByClassName('form-control');
  // loop over each input and watch blur event
  const validation = Array.prototype.filter.call(inputs, (input) => {
    input.addEventListener(
      'blur',
      () => {
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

  // ************************************************************************** //
  // ************** Validate bootstrap forms on the submit event ************** //
  // ************************************************************************** //
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  const validation2 = Array.prototype.filter.call(forms, (form) => {
    form.addEventListener('submit', (event) => {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // ************************************************************************** //
  // ************* Custom input of type number with + and - button ************ //
  // ************************************************************************** //
  if ($('.btn-number')) {
    $('.btn-number').click(function (e) {
      e.preventDefault();
      const fieldName = $(this).data('field');
      const type = $(this).data('type');
      const input = $(`input[name='${fieldName}']`);
      const incrementDecrement = parseInt(input.data('increaseby'), 10);
      const currentVal = parseInt(input.val(), 10);

      if (!currentVal.isNaN) {
        if (type === 'minus') {
          if (currentVal > input.attr('min')) {
            input.val(currentVal - incrementDecrement).change();
          }
          if (parseInt(input.val(), 10) === parseInt(input.attr('min'), 10)) {
            $(this).attr('disabled', true);
          }
        } else if (type === 'plus') {
          if (currentVal < input.attr('max')) {
            input.val(currentVal + incrementDecrement).change();
          }
          if (parseInt(input.val(), 10) === parseInt(input.attr('max'), 10)) {
            $(this).attr('disabled', true);
          }
        }
      } else {
        input.val(0);
      }

      //Change total price
      let totalUnits = 1;
      $(`input[type='number']`).each(function () {
        totalUnits *= $(this).val() / parseInt($(this).data('increaseby'), 10);
      });
      $('.product-price span').text(
        totalUnits * parseInt($('#price').val(), 10)
      );
    });

    $('.input-number').focusin(function () {
      $(this).data('oldValue', $(this).val());
    });

    // ********************* Handle + and -  ********************* //
    $('.input-number').change(function () {
      const minValue = parseInt($(this).attr('min'), 10);
      const maxValue = parseInt($(this).attr('max'), 10);
      const valueCurrent = parseInt($(this).val(), 10);
      const name = $(this).attr('name');

      if (valueCurrent >= minValue) {
        $(`.btn-number[data-type='minus'][data-field='${name}']`).removeAttr(
          'disabled'
        );
      } else {
        $(this).val($(this).data('oldValue'));
      }
      if (valueCurrent <= maxValue) {
        $(`.btn-number[data-type='plus'][data-field='${name}']`).removeAttr(
          'disabled'
        );
      } else {
        $(this).val($(this).data('oldValue'));
      }
    });
  }
};

export default formHandler;
