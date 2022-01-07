const nodemailer = require('nodemailer');
const ejs = require('ejs');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    // this.lastName = user.name.split(' ')[1];
    this.url = url;
    this.from = `Maii Artisan Patisserie<${process.env.EMAIL_FROM}>`;
    this.alldata = user;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send the actual email
    //1) Render HTML based on the template
    const html = await ejs.renderFile(
      `${__dirname}/../views/email/${template}.ejs`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
        alldata: this.alldata,
      }
    );

    //Define e-mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //Create a transport and sendemail

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Maii Artisan Patisserie Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset password (valid for only  10 minutes'
    );
  }

  async sendContactUs() {
    await this.send(
      'contactUs',
      'New contact form message from Maii Artisan Patisserie Family'
    );
  }
};
