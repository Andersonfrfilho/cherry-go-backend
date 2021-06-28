import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateServiceProvider = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    amount: Joi.number().required(),
    duration: Joi.number().required(),
  },
});

export { schemaCreateServiceProvider };
