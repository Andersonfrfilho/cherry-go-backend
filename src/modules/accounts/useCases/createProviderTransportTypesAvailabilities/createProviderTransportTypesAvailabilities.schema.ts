import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProviderTransportTypesAvailabilities = celebrate({
  [Segments.BODY]: {
    transports_types: Joi.array().items(
      Joi.object({
        transport_type_id: Joi.string(),
        amount: Joi.number().optional(),
      })
    ),
  },
});

export { schemaCreateProviderTransportTypesAvailabilities };
