import { celebrate, Joi, Segments } from "celebrate";

export const schemaGetProviders = celebrate({
  [Segments.BODY]: {
    address: Joi.string().lowercase().required(),
  },
});
