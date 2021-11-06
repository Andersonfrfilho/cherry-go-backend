import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateLocalProviders = celebrate({
  [Segments.BODY]: {
    provider_addresses_ids: Joi.array().required(),
  },
});

export { schemaCreateLocalProviders };
