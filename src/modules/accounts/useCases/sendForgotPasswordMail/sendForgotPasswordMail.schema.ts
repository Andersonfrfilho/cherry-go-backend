import { celebrate, Joi, Segments } from "celebrate";

const schemaSendForgotPassword = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});

export { schemaSendForgotPassword };
