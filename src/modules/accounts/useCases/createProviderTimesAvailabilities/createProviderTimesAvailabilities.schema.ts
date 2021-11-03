import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProviderTimesAvailabilities = celebrate({
  [Segments.BODY]: {
    start_hour: Joi.string().required(),
    end_hour: Joi.string().required(),
  },
});

export { schemaCreateProviderTimesAvailabilities };
