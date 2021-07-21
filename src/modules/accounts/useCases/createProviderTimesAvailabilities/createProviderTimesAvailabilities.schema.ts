import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProviderTimesAvailabilities = celebrate({
  [Segments.BODY]: {
    times: Joi.array().items(
      Joi.object({
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
      })
    ),
  },
});

export { schemaCreateProviderTimesAvailabilities };
