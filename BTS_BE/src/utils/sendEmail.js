import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

//function to send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"bakcend ledger<${process.env.EMAIL_USER}>"`, //sender address
      to, //list of receivers
      subject, //subject line
      text, //plain text body
      html, //html body
    });
    console.log(`Message sent:%s`, info.messageId);
    console.log(`preview URL:%s`, nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(`Error sending email`, error);
  }
};

export const sendRegistationEmail = async (userEmail, name) => {
  const subject = `Welcome to Backend Ledger!`;
  const text = ` HeLlo ${name}, \n\nThank you for registering at Backend Ledger.
We're excited to have you on board! \n\n Best regards, \nThe Backend Ledger Team`;

  const html = `<p>Hello ${name} Thank you for registering at Backend Ledger. We re excited to have you on board!</p>
  <p>Best regards,<br>The Backend Ledger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
};
