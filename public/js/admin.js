import axios from 'axios';
import { showAlert } from './alerts';

export const updateProduct = async (_id, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/products/${_id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated product successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const updateProduct = async ({
//   _id,
//   name,
//   ingredients,
//   weight,
//   orderByWeight,
//   customColors,
//   customFlavors,
//   price,
//   summary,
//   description,
//   isFeatured,
// }) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `/api/v1/products/${_id}`,
//       data: {
//         name,
//         ingredients,
//         // weight,
//         orderByWeight,
//         customColors,
//         customFlavors,
//         price,
//         summary,
//         description,
//         isFeatured,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Updated product successfully!');
//       window.setTimeout(() => {
//         location.reload(true);
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
