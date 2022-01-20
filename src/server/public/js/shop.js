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
    $('#carousel-multiple').on('slide.bs.carousel', (e) => {
      const $e = $(e.relatedTarget);
      const idx = $e.index();
      const itemsPerSlide = 5;
      const totalItems = $('.carousel-item').length;

      if (idx >= totalItems - (itemsPerSlide - 1)) {
        const it = itemsPerSlide - (totalItems - idx);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < it; i++) {
          // append slides to end
          if (e.direction === 'left') {
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
  }
};
