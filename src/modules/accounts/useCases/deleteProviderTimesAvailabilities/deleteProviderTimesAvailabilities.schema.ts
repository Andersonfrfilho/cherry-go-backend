import { celebrate, Joi, Segments } from "celebrate";

export const schemaDeleteProviderTimesAvailabilities = celebrate({
  [Segments.BODY]: {
    hour_id: Joi.string().required(),
  },
});
