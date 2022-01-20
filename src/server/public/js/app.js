import contactUs from './contactUs';
import render3dImage from './3dimage.js';
import { showAlert } from './alerts';

const app = () => {
  // const alertMessage = document.querySelector('body').dataset.alert;
  // if (alertMessage) showAlert('success', alertMessage, 20);
  // ************************************************************************** //
  // ************************ Collapse navBar after use *********************** //
  // ************************************************************************** //
  const navLinks = document.querySelectorAll('.nav-item');
  const menuToggle = document.getElementById('navbarSupportedContent');
  const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
  bsCollapse.hide();

  navLinks.forEach((l) => {
    l.addEventListener('click', () => {
      bsCollapse.toggle();
    });
  });

  // ************************************************************************** //
  // **************************** Display 3d image **************************** //
  // ************************************************************************** //
  const image3d = document.querySelector('.image3d');
  if (image3d) {
    render3dImage(
      '.image3d',
      './../images/image.jpg',
      './../images/image_depth.jpg'
    );
  }

  // ************************************************************************** //
  // ********************* Handle Contact Us functionality ******************** //
  // ************************************************************************** //

  const contactForm = document.querySelector('#contact-form');
  if (contactForm)
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = contactForm.querySelector('[type = "submit"]');
      const buttonInnerText = button.innerText;
      button.innerText = 'Processing...';
      button.disabled = true;
      const name = document.getElementById('name').value;
      const surname = document.getElementById('surname').value;
      const email = document.getElementById('email').value;
      const url = document.getElementById('url').value;
      const message = document.getElementById('message').value;
      await contactUs(name, surname, email, url, message);
      button.innerText = buttonInnerText;
      button.disabled = false;
    });
};

export default app;
