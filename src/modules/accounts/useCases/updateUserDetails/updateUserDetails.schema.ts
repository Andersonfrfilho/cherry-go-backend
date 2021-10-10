import { celebrate, Joi, Segments } from "celebrate";

export const schemaUpdateUserDetails = celebrate({
  [Segments.BODY]: {
    details: Joi.object(),
  },
});
