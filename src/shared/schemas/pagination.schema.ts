import { celebrate, Joi, Segments } from "celebrate";

const schemaPagination = celebrate({
  [Segments.BODY]: {
    per_page: Joi.string(),
    page: Joi.string(),
    order: Joi.object({
      property: Joi.string(),
      ordering: Joi.string(),
    }),
    fields: Joi.object({}),
  },
});

export { schemaPagination };
