import { celebrate, Joi, Segments } from "celebrate";

export const schemaGetDistanceByLocals = celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().required(),
    departure_time: Joi.string().required(),
  },
});
