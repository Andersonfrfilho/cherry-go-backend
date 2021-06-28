import { celebrate, Joi, Segments } from "celebrate";

const schemaAuthenticate = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(15).required(),
  },
});

export { schemaAuthenticate };
