import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateUserPhoneClient = celebrate({
  [Segments.BODY]: {
    country_code: Joi.string().max(3).min(3).required(),
    ddd: Joi.string().max(3).min(3).required(),
    number: Joi.string().min(8).max(9).required(),
  },
});

export { schemaCreateUserPhoneClient };
