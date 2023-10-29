import { Queue } from "bullmq";
import { Worker } from "bullmq";

export const messageQueue = new Queue("message");
const worker = new Worker("message", async (job) => {});
