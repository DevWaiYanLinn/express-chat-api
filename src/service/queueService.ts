import { Queue } from "bullmq";
import { Worker } from "bullmq";
import Mailer from "./mailService";
import config, { CONFIRM_EMAIL } from "../config/config";
import ConfirmationMail from "../mail/confirmationMail";
import JsonWebToken from "./jwtService";

const connection = {
  host: config.redis.host,
  port: config.redis.port,
};

export const emailQueue = new Queue("email", { connection });

const worker = new Worker(
  "email",
  async (job) => {
    const { data } = job;
    if (data.type === CONFIRM_EMAIL) {
      const jwt = new JsonWebToken({ email: data.to });
      const emailConfirmToken = jwt.createEmailConfirmToken();
      const mail = new ConfirmationMail({ emailConfirmToken });
      await Mailer.send(data.to, mail);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
