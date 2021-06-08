import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateTagsUsersClient = celebrate({
  [Segments.BODY]: {
    tags: Joi.array().required(),
  },
});

export { schemaCreateTagsUsersClient };
