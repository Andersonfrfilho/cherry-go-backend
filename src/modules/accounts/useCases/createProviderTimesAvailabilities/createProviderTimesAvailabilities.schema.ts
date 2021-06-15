import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProviderTimesAvailabilities = celebrate({
  [Segments.BODY]: {
    days: Joi.array().required(),
  },
});

export { schemaCreateProviderTimesAvailabilities };
