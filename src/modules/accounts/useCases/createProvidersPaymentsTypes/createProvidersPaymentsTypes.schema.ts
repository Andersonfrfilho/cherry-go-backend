import { celebrate, Joi, Segments } from "celebrate";

import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";

const schemaCreateProvidersPaymentsTypes = celebrate({
  [Segments.BODY]: {
    payments_types: Joi.array().items(
      Joi.string().valid(
        PAYMENT_TYPES_ENUM.CARD_CREDIT,
        PAYMENT_TYPES_ENUM.CARD_DEBIT,
        PAYMENT_TYPES_ENUM.MONEY,
        PAYMENT_TYPES_ENUM.PIX
      )
    ),
  },
});

export { schemaCreateProvidersPaymentsTypes };
