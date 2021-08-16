import { celebrate, Joi, Segments } from "celebrate";

export const schemaResendConfirmationMailUserMailService = celebrate({
  [Segments.BODY]: {
    email: Joi.string().required(),
  },
});
