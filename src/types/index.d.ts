export interface MailInterface {
  text: () => string | undefined;
  html: () => Promise<string>;
  subject:() => string
}

export type HttpCode = 200 | 400 | 422 | 409 | 500;
