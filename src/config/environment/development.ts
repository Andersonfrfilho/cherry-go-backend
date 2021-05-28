export const development = {
  mail: {
    token: {
      expiration_time:
        Number(process.env.TOKEN_EXPIRATION_TIME_MAIL_CONFIRMATION) || 30,
    },
  },
};
