import { celebrate, Joi, Segments } from "celebrate";

export const schemaConfirmPhonesUserInside = celebrate({
  [Segments.BODY]: {
    token: Joi.string().required(),
    code: Joi.string().length(4).required(),
    user_id: Joi.string().guid({ version: "uuidv4" }).required(),
  },
});
