import { celebrate, Joi, Segments } from "celebrate";

const schemaResendPhoneCodeUserClient = celebrate({
  [Segments.BODY]: {
    user_id: Joi.string().required(),
  },
});

export { schemaResendPhoneCodeUserClient };
