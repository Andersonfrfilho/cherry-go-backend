export default {
  secret: {
    token: process.env.HASH_TOKEN || "89ba023086e37a345839e0c6a0d272eb",
    refresh:
      process.env.HASH_REFRESH_TOKEN || "a7e071b3de48cec1dd24de6cbe6c7bf1",
  },
  expires_in: {
    token: "15m",
    refresh: "30d",
    refresh_days: 30,
  },
};
