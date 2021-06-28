import { celebrate, Joi, Segments } from "celebrate";

const schemaRefreshToken = celebrate({
  [Segments.BODY]: {
    token: Joi.string().optional(),
  },
  [Segments.QUERY]: {
    token: Joi.string().optional(),
  },
  [Segments.HEADERS]: Joi.object({
    "x-access-tokens": Joi.string().optional(),
  }).unknown(),
});

export { schemaRefreshToken };
