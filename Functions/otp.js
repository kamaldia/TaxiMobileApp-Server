// import OTP from "otp";
// import nodemailer from "nodemailer";

// export const generateOTP = () => OTP.generate(6, { specialChars: false });

// export const generateOTPWithTimer = () => { //returns an object
//   const otp = OTP.generate(6, { specialChars: false });
//   const timestamp = Date.now(); //millisecs
//   return { otp, timestamp };
// };

// export const sendOTPByEmail = async (email, otp) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       service: "hotmail",
//       auth: {
//         user: process.env.ADMIN_EMAIL,
//         pass: process.env.ADMIN_PASSWORD,
//       },
//     });

//     let MailOptions = {
//       from: process.env.ADMIN_EMAIL,
//       to: email,
//       subject: "Taxi app one time password",
//       text: `Available for 5 minutes, your code: ${otp}`,
//     };

//     await transporter.sendMail(MailOptions);
//     console.log("OTP is sent successfully");
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//   }
// };
