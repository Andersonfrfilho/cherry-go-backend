import { celebrate, Joi, Segments } from "celebrate";

const schemaGetAllHoursAvailableProvider = celebrate({
  [Segments.QUERY]: {
    provider_id: Joi.string().required(),
    duration: Joi.number().required(),
  },
});

export { schemaGetAllHoursAvailableProvider };
