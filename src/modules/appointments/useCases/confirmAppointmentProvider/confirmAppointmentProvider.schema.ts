import { celebrate, Joi, Segments } from "celebrate";

const schemaConfirmAppointmentProvider = celebrate({
  [Segments.BODY]: {
    appointment_id: Joi.string().required(),
  },
});

export { schemaConfirmAppointmentProvider };
