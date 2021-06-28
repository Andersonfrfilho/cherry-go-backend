import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateProvidersPaymentsTypes = celebrate({
  [Segments.BODY]: {
    payments_types: Joi.array().required(),
  },
});

export { schemaCreateProvidersPaymentsTypes };
