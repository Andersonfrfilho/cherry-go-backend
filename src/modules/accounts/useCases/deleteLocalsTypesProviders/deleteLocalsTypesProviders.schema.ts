import { celebrate, Joi, Segments } from "celebrate";

const schemaDeleteLocalsTypesProviders = celebrate({
  [Segments.BODY]: {
    provider_locals_types_ids: Joi.array().required(),
  },
});

export { schemaDeleteLocalsTypesProviders };
