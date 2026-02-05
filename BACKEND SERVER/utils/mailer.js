// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "atharvawaghmare878@gmail.com",
//     pass: "fhtqeewwsvpclvee"
//   }
// });

// const sendOTP = async (email, otp) => {
//   await transporter.sendMail({
//     from: '"BookMitra Support" <atharvawaghmare@gmail.com>',
//     to: email,
//     subject: "Password Reset OTP - BookMitra",
//     html: `
//       <h2>Password Reset Request</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP will expire in 5 minutes.</p>
//     `
//   });
// };

// module.exports = sendOTP;


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "atharvawaghmare878@gmail.com",   // your gmail
    pass: "tstoekfvlxqouzby",     // google app password
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: '"BookMitra Support" <atharvawaghmare878@gmail.com>',
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h3>Your OTP for password reset</h3>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

module.exports = sendOTP;
