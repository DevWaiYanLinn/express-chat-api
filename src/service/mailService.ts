import nodemailer from "nodemailer";
import config from "../config/config";

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
          text: mail.text(),
          html: await mail.htmlBody(),
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
