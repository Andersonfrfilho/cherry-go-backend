import { celebrate, Joi, Segments } from "celebrate";

export const schemaGetProviders = celebrate({
  [Segments.BODY]: {
    distance: Joi.number(),
    longitude: Joi.string(),
    latitude: Joi.string(),
  },
});
