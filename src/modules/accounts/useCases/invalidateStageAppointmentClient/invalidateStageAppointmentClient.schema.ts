import { celebrate, Joi, Segments } from "celebrate";

export const schemaInvalidateStageAppointmentClient = celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().required(),
    distance: Joi.string(),
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional(),
  },
});
