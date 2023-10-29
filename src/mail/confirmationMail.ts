import { Edge } from "edge.js";
import { join } from "path";

type Transcation = {
  emailConfirmToken: string;
};

class ConfirmationMail implements MailInterface {
  private transcation: Transcation;

  constructor(transcation: Transcation) {
    this.transcation = transcation;
  }

  text(): string | undefined {
    return undefined;
  }

  htmlBody(): Promise<string> {
    return new Promise(async (resolve) => {
      const edge = new Edge({ cache: false });
      edge.mount(join(__dirname, "templates"));
      const html = await edge.render("emailConfirmation", this.transcation);
      resolve(html);
    });
  }
}

export default ConfirmationMail;
