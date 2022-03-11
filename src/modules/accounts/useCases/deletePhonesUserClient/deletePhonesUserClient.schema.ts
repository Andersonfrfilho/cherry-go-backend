import { celebrate, Joi, Segments } from "celebrate";

const schemaDeleteUserPhoneClient = celebrate({
  [Segments.BODY]: {
    user_id: Joi.string().required(),
    country_code: Joi.string().max(4).min(3).required(),
    ddd: Joi.string().max(2).min(2).required(),
    number: Joi.string().min(8).max(9).required(),
  },
});
export { schemaDeleteUserPhoneClient };
