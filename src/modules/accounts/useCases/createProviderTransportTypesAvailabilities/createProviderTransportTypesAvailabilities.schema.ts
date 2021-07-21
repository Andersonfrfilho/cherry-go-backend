import { celebrate, Joi, Segments } from "celebrate";

import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";

const schemaCreateProviderTransportTypesAvailabilities = celebrate({
  [Segments.BODY]: {
    transport_types: Joi.array().items(
      Joi.object({
        name: Joi.string().valid(
          TRANSPORT_TYPES_ENUM.CLIENT,
          TRANSPORT_TYPES_ENUM.PROVIDER,
          TRANSPORT_TYPES_ENUM.UBER
        ),
        amount: Joi.number().optional(),
      })
    ),
  },
});

export { schemaCreateProviderTransportTypesAvailabilities };
