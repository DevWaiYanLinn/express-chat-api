export interface MailInterface {
  text: () => string | undefined;
  html: () => Promise<string>;
  subject:() => string
}
