import { celebrate, Joi, Segments } from "celebrate";

export const schemaCreateTags = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    description: Joi.string().optional(),
    active: Joi.boolean().required(),
    image_id: Joi.string().required(),
  },
});
