import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateTagsUsersClient = celebrate({
  [Segments.BODY]: {
    client_tags: Joi.array(),
    client_tags_exclude: Joi.array(),
  },
});

export { schemaCreateTagsUsersClient };
