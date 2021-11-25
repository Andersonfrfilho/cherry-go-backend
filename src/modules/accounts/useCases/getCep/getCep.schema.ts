import { celebrate, Joi, Segments } from "celebrate";

const schemaGetCep = celebrate({
  [Segments.BODY]: {
    cep: Joi.string().required(),
  },
});

export { schemaGetCep };
