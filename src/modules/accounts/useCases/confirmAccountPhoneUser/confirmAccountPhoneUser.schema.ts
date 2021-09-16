import { celebrate, Joi, Segments } from "celebrate";

const schemaConfirmAccountPhoneUser = celebrate({
  [Segments.BODY]: {
    token: Joi.string().required(),
    code: Joi.string().length(4).required(),
    user_id: Joi.string().required(),
  },
});

export { schemaConfirmAccountPhoneUser };
