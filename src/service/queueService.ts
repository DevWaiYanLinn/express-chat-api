import { Queue } from "bullmq";
import { Worker } from "bullmq";
import Mailer from "./mailService";
import config from "../config/config";

const connection = {
  host: config.redis.host,
  port: Number(config.redis.port),
};

export const emailQueue = new Queue("email", { connection });

const worker = new Worker(
  "email",
  async (job) => {
    const {
      data: { to, mail },
    }: { data: { to: string; mail: MailInterface } } = job;
    await Mailer.send(to, mail);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});
