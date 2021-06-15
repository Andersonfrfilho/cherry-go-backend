import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProviderDaysAvailabilities = celebrate({
  [Segments.BODY]: {
    days: Joi.array().required(),
  },
});

export { schemaCreateProviderDaysAvailabilities };
