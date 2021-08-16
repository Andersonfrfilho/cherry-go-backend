import { celebrate, Joi, Segments } from "celebrate";

export const schemaResendConfirmationMailUser = celebrate({
  [Segments.BODY]: {
    token: Joi.string().required(),
  },
});
