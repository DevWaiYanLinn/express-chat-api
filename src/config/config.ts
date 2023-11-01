import { env } from "../lib/helper";

export default {
  redis: {
    host: env("REDIS_HOST", "localhost"),
    port: env("REDIS_PORT", 6379),
  },
  mongodb: {
    url: env(
      "MONGODB_URL",
      "mongodb://DESKTOP-OUSQB3M:27019/chat?replicaSet=rs"
    ),
  },
  mail: {
    service: env("MAIL_SERVICE", "gmail"),
    user: env("MAIL_USER", "example@gmail.com"),
    pass: env("MAIL_PASS", "password"),
    from: env("MAIL_FROM", "FlirtFlow App"),
  },
  jwt: {
    secret: env("JWT_SECRET", "12345"),
  },
} as const;

export const CONFIRM_EMAIL = "CONFIRM_EMAIL";
