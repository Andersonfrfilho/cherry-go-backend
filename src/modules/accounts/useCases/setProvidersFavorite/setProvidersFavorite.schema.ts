import { celebrate, Joi, Segments } from "celebrate";

export const schemaSetProvidersFavorite = celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().required(),
  },
});
