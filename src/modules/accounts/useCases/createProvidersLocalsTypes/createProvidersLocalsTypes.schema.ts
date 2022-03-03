import { celebrate, Joi, Segments } from "celebrate";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";

const schemaCreateProvidersLocalsTypes = celebrate({
  [Segments.BODY]: {
    locals_types: Joi.array().items(
      Joi.string().valid(LOCALS_TYPES_ENUM.client, LOCALS_TYPES_ENUM.provider)
    ),
  },
});

export { schemaCreateProvidersLocalsTypes };
