import { celebrate, Joi, Segments } from "celebrate";

const schemaRejectAppointmentProvider = celebrate({
  [Segments.BODY]: {
    appointment_id: Joi.string().required(),
  },
});

export { schemaRejectAppointmentProvider };
