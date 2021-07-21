import { celebrate, Joi, Segments } from "celebrate";

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";

const schemaCreateProviderDaysAvailabilities = celebrate({
  [Segments.BODY]: {
    days: Joi.array().items(
      Joi.string().valid(
        DAYS_WEEK_ENUM.FRIDAY,
        DAYS_WEEK_ENUM.MONDAY,
        DAYS_WEEK_ENUM.SATURDAY,
        DAYS_WEEK_ENUM.SUNDAY,
        DAYS_WEEK_ENUM.THURSDAY,
        DAYS_WEEK_ENUM.TUESDAY,
        DAYS_WEEK_ENUM.WEDNESDAY
      )
    ),
  },
});

export { schemaCreateProviderDaysAvailabilities };
