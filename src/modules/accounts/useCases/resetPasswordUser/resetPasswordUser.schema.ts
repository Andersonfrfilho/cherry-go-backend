import { celebrate, Joi, Segments } from "celebrate";

const schemaResetPassword = celebrate({
  [Segments.BODY]: {
    password: Joi.string().min(6).max(15).required(),
  },
  [Segments.QUERY]: {
    token: Joi.string().required(),
  },
});

export { schemaResetPassword };
