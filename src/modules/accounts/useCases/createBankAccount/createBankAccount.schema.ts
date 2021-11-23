import { celebrate, Joi, Segments } from "celebrate";

const schemaCreateBankAccount = celebrate({
  [Segments.BODY]: {
    country_code: Joi.string().length(2).required(),
    branch_number: Joi.string().length(4).required(),
    account_number: Joi.string().max(10).required(),
    account_holder_name: Joi.string().max(20).required(),
    name_account_bank: Joi.string().max(30).required(),
    code_bank: Joi.string().max(3).required(),
  },
});

export { schemaCreateBankAccount };
