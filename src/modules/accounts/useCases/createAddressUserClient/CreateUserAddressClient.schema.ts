import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateUserAddressClient = celebrate({
  [Segments.BODY]: {
    street: Joi.string().required(),
    number: Joi.string().required(),
    zipcode: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  },
});

export { schemaCreateUserAddressClient };
