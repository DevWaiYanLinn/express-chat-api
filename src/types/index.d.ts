interface MailInterface {
  text(): string | undefined;
  htmlBody(): Promise<string>;
}
