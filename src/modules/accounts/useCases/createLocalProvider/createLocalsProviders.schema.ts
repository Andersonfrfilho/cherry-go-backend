import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateLocalProviders = celebrate({
  [Segments.BODY]: {
    amount: Joi.number().required(),
    city: Joi.string().required(),
    complement: Joi.string().required(),
    country: Joi.string().required(),
    district: Joi.string().required(),
    number: Joi.string().required(),
    reference: Joi.string().required(),
    state: Joi.string().required(),
    street: Joi.string().required(),
    zipcode: Joi.string().required(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
  },
});

export { schemaCreateLocalProviders };
