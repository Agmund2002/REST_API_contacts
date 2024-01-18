import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_FROM, UKR_NET_PASSWORD } = process.env;

const nmConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nmConfig);

const sendEmail = (data) => {
  const emailBody = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(emailBody);
};

export default sendEmail;
