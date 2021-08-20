import { celebrate, Joi, Segments } from "celebrate";

export const schemaCreatePhonesUserInside = celebrate({
  [Segments.BODY]: {
    country_code: Joi.string().max(4).min(3).required(),
    ddd: Joi.string().max(2).min(2).required(),
    number: Joi.string().min(8).max(9).required(),
    user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  },
});
