import { celebrate, Joi, Segments } from "celebrate";

const schemaRefreshToken = celebrate({
  [Segments.BODY]: {
    refresh_token: Joi.string().optional(),
  },
  [Segments.QUERY]: {
    refresh_token: Joi.string().optional(),
  },
  [Segments.HEADERS]: Joi.object({
    "x-access-refresh-token": Joi.string().optional(),
  }).unknown(),
});

export { schemaRefreshToken };
