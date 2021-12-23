import { celebrate, Joi, Segments } from "celebrate";

export const schemaUpdateUserDetails = celebrate({
  [Segments.BODY]: {
    name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
  },
});
