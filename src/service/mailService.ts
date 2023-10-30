import nodemailer from "nodemailer";
import config from "../config/config";
import { MailInterface } from "../types";

const tranSporter = nodemailer.createTransport({
  service: config.mail.service,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

const mailOptions = {
  from: config.mail.from,
};

class Mailer {
  public async send(to: string, mail: MailInterface) {
    return new Promise(async (resolve, reject) => {
      tranSporter.sendMail(
        {
          ...mailOptions,
          to,
          subject: mail.subject(),
          text: mail.text(),
          html: await mail.html(),
        },
        function (err, info) {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }
}

export default new Mailer();
