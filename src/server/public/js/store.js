const Store = {
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

document.addEventListener('DOMContentLoaded', () => {
  Store.quantity();
});
