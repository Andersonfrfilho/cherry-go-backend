export enum STRIPE_TAX_ID_VALUE {
  br_cnpj = "br_cnpj",
  br_cpf = "br_cpf",
}

export enum STRIPE_ACCOUNT_COUNTRY {
  br = "br",
}

export enum STRIPE_ACCOUNT_TYPE {
  custom = "custom",
  express = "express",
  standard = "standard",
}

export enum STRIPE_BUSINESS_TYPE {
  individual = "individual",
  company = "company",
  non_profit = "non_profit",
  government_entity = "government_entity",
}

export enum STRIPE_PURPOSE_DOCUMENT {
  account_requirement = "account_requirement",
  identity_document = "identity_document",
  document_provider_identity_document = "document_provider_identity_document",
}

/**
 * site de listagem de mmc
 * https://stripe.com/docs/connect/setting-mcc#list
 */
export enum STRIPE_BUSINESS_PROFILE_CODE_MCC {
  dating_escort_services = "7273",
}
