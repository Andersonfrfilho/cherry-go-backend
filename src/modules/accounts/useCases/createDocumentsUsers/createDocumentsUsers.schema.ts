import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateDocumentsUsersClient = celebrate({
  [Segments.BODY]: {
    tags: Joi.array().required(),
  },
});

export { schemaCreateDocumentsUsersClient };
