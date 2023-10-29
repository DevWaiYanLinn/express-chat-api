import nodemailer from "nodemailer";

const tranSporter = nodemailer.createTransport({
  service: "gmail",
  auth: {},
});
