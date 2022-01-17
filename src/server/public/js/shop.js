export const Store = {
  quantity: () => {
    const qtyWrap = document.querySelectorAll('.qty-wrap');
    if (qtyWrap.length > 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < qtyWrap.length; i++) {
        const qty = qtyWrap[i];
        const minus = qty.querySelector('.qty-minus');
        const plus = qty.querySelector('.qty-plus');
        const input = qty.querySelector('.qty');
        let value = parseInt(input.value, 10);

        plus.addEventListener('click', () => {
          value += 1;
          input.value = value;
        });

        minus.addEventListener('click', () => {
          value = value > 1 ? value - 1 : 1;
          input.value = value;
        });
      }
    }
  },
};

// document.addEventListener('DOMContentLoaded', () => {
//   Store.quantity();
// });

// ************************************************************************** //
// ****************************** Product Page ****************************** //
// ************************************************************************** //
export const shopHandler = () => {
  const productWrapper = document.querySelector('.product-wrapper');
  if (productWrapper) {
    // ***************************** Carousel Slider **************************** //

    $('#carousel-multiple').on('slide.bs.carousel', function (e) {
      var $e = $(e.relatedTarget);
      var idx = $e.index();
      var itemsPerSlide = 5;
      var totalItems = $('.carousel-item').length;

      if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
          // append slides to end
          if (e.direction == 'left') {
            $('.carousel-item').eq(i).appendTo('.carousel-inner');
          } else {
            $('.carousel-item').eq(0).appendTo('.carousel-inner');
          }
        }
      }
    });

    // ****************************** IMAGE SLIDER ****************************** //
    const thumbnails = document.getElementsByClassName('product-thumbnail');
    const activeImages = document.getElementsByClassName('product-active');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < thumbnails.length; i++) {
      thumbnails[i].addEventListener('mouseover', function () {
        if (activeImages.length > 0) {
          activeImages[0].classList.remove('product-active');
        }
        this.classList.add('product-active');
        document.getElementById('product-featured').src = this.src;
      });
    }
    const buttonRight = document.getElementById('product-slideRight');
    const buttonLeft = document.getElementById('product-slideLeft');
    buttonLeft.addEventListener('click', () => {
      document.getElementById('product-slider').scrollLeft -= 180;
    });
    buttonRight.addEventListener('click', () => {
      document.getElementById('product-slider').scrollLeft += 180;
    });

    // ************************* Handle + and - for q-ty ************************ //
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
          if (parseInt(input.val(), 10) === input.attr('min')) {
            $(this).attr('disabled', true);
          }
        } else if (type === 'plus') {
          if (currentVal < input.attr('max')) {
            input.val(currentVal + incrementDecrement).change();
          }
          if (parseInt(input.val(), 10) === input.attr('max')) {
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

    // ********************* Handle + and - for weight,size ********************* //
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
