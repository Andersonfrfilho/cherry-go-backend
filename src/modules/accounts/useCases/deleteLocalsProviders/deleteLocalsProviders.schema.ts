import { celebrate, Joi, Segments } from "celebrate";

const schemaDeleteLocalsProviders = celebrate({
  [Segments.BODY]: {
    provider_addresses_ids: Joi.array().required(),
  },
});

export { schemaDeleteLocalsProviders };
