import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateServiceProvider = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    amount: Joi.string().required(),
    duration: Joi.alternatives().try(Joi.string(), Joi.number()),
    tags_id: Joi.array().optional(),
  },
});

export { schemaCreateServiceProvider };
