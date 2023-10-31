import { Edge } from "edge.js";
import { join } from "path";
import { MailInterface } from "../types";

type Transcation = {
  emailConfirmToken: string;
};

class ConfirmationMail implements MailInterface {
  public readonly transcation: Transcation;

  constructor(transcation: Transcation) {
    this.transcation = transcation;
  }

  public subject() {
    return "Confirm Your Email";
  }

  public text(): string | undefined {
    return undefined;
  }

  public html(): Promise<string> {
    return new Promise(async (resolve) => {
      const edge = new Edge({ cache: false });
      edge.mount(join(__dirname, "templates"));
      const html = await edge.render("emailConfirmation", this.transcation);
      resolve(html);
    });
  }
}

export default ConfirmationMail;
