import { celebrate, Joi, Segments } from "celebrate";

import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";

const schemaCreateProvidersPaymentsTypes = celebrate({
  [Segments.BODY]: {
    payments_types: Joi.array().items(
      Joi.string().valid(
        PAYMENT_TYPES_ENUM.credit,
        PAYMENT_TYPES_ENUM.debit,
        PAYMENT_TYPES_ENUM.money,
        PAYMENT_TYPES_ENUM.pix
      )
    ),
  },
});

export { schemaCreateProvidersPaymentsTypes };
