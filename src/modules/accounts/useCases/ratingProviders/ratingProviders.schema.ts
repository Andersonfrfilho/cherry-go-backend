import { celebrate, Joi, Segments } from "celebrate";

export const schemaRatingProviders = celebrate({
  [Segments.BODY]: {
    details: Joi.any().optional(),
    provider_id: Joi.string().required(),
    value: Joi.string().required(),
  },
});
