import { celebrate, Joi, Segments } from "celebrate";
import { differenceInYears } from "date-fns";

const schemaGetReverseGeolocation = celebrate({
  [Segments.BODY]: {
    latitude: Joi.string().lowercase().required(),
    longitude: Joi.string().lowercase().required(),
  },
});

export { schemaGetReverseGeolocation };
