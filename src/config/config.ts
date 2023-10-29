const env = (key: string, defaultValue: string): string => {
  if (process.env[key] !== undefined) {
    return process.env[key] as string;
  }
  return defaultValue;
};

export default {
  redis: {
    host: env("REDIS_HOST", "localhost"),
    port: env("REDIS_PORT", "6379"),
  },
  mongodb: {
    url: env(
      "MONGODB_URL",
      "mongodb://DESKTOP-OUSQB3M:27019/chat?replicaSet=rs"
    ),
  },
  mail: {
    service: env("MAIL_SERVICE", "gmail"),
    user: env("MAIL_USER", "waiyanlin.lion@gmail.com"),
    pass: env("MAIL_PASS", "qgpg avjz oqtw bplx"),
    from: env("MAIL_FROM", "FlirtFlow App"),
  },
};
