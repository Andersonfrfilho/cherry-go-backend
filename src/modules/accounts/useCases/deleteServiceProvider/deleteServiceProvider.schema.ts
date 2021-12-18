import { celebrate, Joi, Segments } from "celebrate";

const schemaDeleteServiceProvider = celebrate({
  [Segments.BODY]: {
    service_id: Joi.string().required(),
  },
});

export { schemaDeleteServiceProvider };
