import { celebrate, Joi, Segments } from "celebrate";

export const schemaCreateAddressUserInside = celebrate({
  [Segments.BODY]: {
    user_id: Joi.string().required(),
    street: Joi.string().required(),
    number: Joi.string().required(),
    zipcode: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional(),
  },
});
