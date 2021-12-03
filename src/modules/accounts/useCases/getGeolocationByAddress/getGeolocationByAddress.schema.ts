import { celebrate, Joi, Segments } from "celebrate";

export const schemaGetGeolocationByAddress = celebrate({
  [Segments.BODY]: {
    address: Joi.string().lowercase().required(),
  },
});
