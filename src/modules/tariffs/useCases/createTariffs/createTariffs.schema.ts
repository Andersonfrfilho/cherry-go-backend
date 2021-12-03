import { celebrate, Joi, Segments } from "celebrate";

export const schemaCreateTariffs = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    percent: Joi.number().required(),
  },
});
