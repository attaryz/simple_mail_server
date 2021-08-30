const express = require("express");
const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const contactAddress = process.env.TO_EMAIL_ADDRESS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: process.env.GMAIL_ADDRESS,
      clientId: process.env.xoauth2ClientId,
      clientSecret: process.env.xoauth2ClientSecret,
      refreshToken: process.env.xoauth2RefreshToken,
    }),
    type: "login",
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/contact", function (req, res) {
  transporter.sendMail(
    {
      from: req.body.email,
      to: [contactAddress],
      subject: req.body.subject || "[No subject]",
      html: req.body.message || "[No message]",
    },
    function (err, info) {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );
});

app.listen(port, console.log(`Server is running on port ${port}`));
