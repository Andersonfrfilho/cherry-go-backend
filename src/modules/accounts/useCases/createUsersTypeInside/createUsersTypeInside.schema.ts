import { celebrate, Joi, Segments } from "celebrate";

const schemaAcceptUser = celebrate({
  [Segments.BODY]: {
    accept: Joi.boolean().required(),
  },
});

export { schemaAcceptUser };
