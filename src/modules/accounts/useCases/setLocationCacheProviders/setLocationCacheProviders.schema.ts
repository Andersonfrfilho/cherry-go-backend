import { celebrate, Joi, Segments } from "celebrate";

export const schemaSetLocationCacheProviders = celebrate({
  [Segments.BODY]: {
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  },
});
