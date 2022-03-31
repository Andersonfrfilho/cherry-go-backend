export enum STRIPE_TAX_ID_VALUE_ENUM {
  br_cnpj = "br_cnpj",
  br_cpf = "br_cpf",
}

export enum STRIPE_ACCOUNT_COUNTRY_ENUM {
  br = "br",
}
export enum STRIPE_PRODUCT_TYPE_ENUM {
  good = "good",
  service = "service",
}
export enum STRIPE_ACCOUNT_TYPE_ENUM {
  custom = "custom",
  express = "express",
  standard = "standard",
}

export enum STRIPE_BUSINESS_TYPE_ENUM {
  individual = "individual",
  company = "company",
  non_profit = "non_profit",
  government_entity = "government_entity",
}

export enum STRIPE_ACCOUNT_BANK_TYPE_ENUM {
  individual = "individual",
  company = "company",
}

export enum STRIPE_PURPOSE_DOCUMENT_ENUM {
  account_requirement = "account_requirement",
  identity_document = "identity_document",
  document_provider_identity_document = "document_provider_identity_document",
}

/**
 * site de listagem de mmc
 * https://stripe.com/docs/connect/setting-mcc#list
 */
export enum STRIPE_BUSINESS_PROFILE_CODE_MCC_ENUM {
  dating_escort_services = "7273",
}

export enum STRIPE_POLITICAL_EXPOSURE_ENUM {
  none = "none",
  existing = "existing",
}

export enum STRIPE_PERSON_GENDER_ENUM {
  male = "male",
  female = "female",
}
export enum STRIPE_INVENTORY_TYPE_SKU_ENUM {
  finite = "finite",
  bucket = "bucket",
  infinite = "infinite",
}

export enum STRIPE_CURRENCY_ENUM {
  brl = "brl",
}

export enum NATIONALITY_ISO_3166_2_ENUM {
  AD = "AD", //	Andorra	7 parishes
  AE = "AE", //	United Arab Emirates	7 emirates
  AF = "AF", //	Afghanistan	34 provinces
  AG = "AG", //	Antigua and Barbuda	6 parishes
  AI = "AI", // Anguilla	—
  AL = "AL", // Albania	12 counties
  AM = "AM", // Armenia	1 city
  AO = "AO", // Angola	18 provinces
  AQ = "AQ", // Antarctica	—
  AR = "AR", // Argentina	1 city
  AS = "AS", // American Samoa	—
  AT = "AT", // Austria	9 states
  AU = "AU", // Australia	6 states
  AW = "AW", // Aruba	—
  AX = "AX", // Åland Islands	—
  AZ = "AZ", // Azerbaijan	1 autonomous republic
  BA = "BA", // Bosnia and Herzegovina	2 entities
  BB = "BB", // Barbados	11 parishes
  BD = "BD", // Bangladesh	8 divisions
  BE = "BE", // Belgium	3 regions
  BF = "BF", // Burkina Faso	13 regions
  BG = "BG", // Bulgaria	28 regions
  BH = "BH", // Bahrain	4 governorates
  BI = "BI", // Burundi	18 provinces
  BJ = "BJ", // Benin	12 departments
  BL = "BL", // Saint Barthélemy	—
  BM = "BM", // Bermuda	—
  BN = "BN", // Brunei Darussalam	4 districts
  BO = "BO", // Bolivia (Plurinational State of)	9 departments
  BQ = "BQ", // Bonaire, Sint Eustatius and Saba	3 special municipalities
  BR = "BR", // Brazil	1 federal district
  BS = "BS", // Bahamas	31 districts
  BT = "BT", // Bhutan	20 districts
  BV = "BV", // Bouvet Island	—
  BW = "BW", // Botswana	10 districts
  BY = "BY", // Belarus	6 oblasts
  BZ = "BZ", // Belize	6 districts
  CA = "CA", // Canada	10 provinces
  CC = "CC", // Cocos (Keeling) Islands	—
  CD = "CD", // Congo, Democratic Republic of the	1 city
  CF = "CF", // Central African Republic	1 commune
  CG = "CG", // Congo	12 departments
  CH = "CH", // Switzerland	26 cantons
  CI = "CI", // Côte d'Ivoire	12 districts
  CK = "CK", // Cook Islands	—
  CL = "CL", // Chile	16 regions
  CM = "CM", // Cameroon	10 regions
  CN = "CN", // China	4 municipalities
  CO = "CO", // Colombia	1 capital district
  CR = "CR", // Costa Rica	7 provinces
  CU = "CU", // Cuba	15 provinces
  CV = "CV", // Cabo Verde	2 geographical regions
  CW = "CW", // Curaçao	—
  CX = "CX", // Christmas Island	—
  CY = "CY", // Cyprus	6 districts
  CZ = "CZ", // Czechia	13 regions and 1 capital city
  DE = "DE", // Germany	16 states
  DJ = "DJ", // Djibouti	5 regions
  DK = "DK", // Denmark	5 regions
  DM = "DM", // Dominica	10 parishes
  DO = "DO", // Dominican Republic	10 regions
  DZ = "DZ", // Algeria	48 provinces
  EC = "EC", // Ecuador	24 provinces
  EE = "EE", // Estonia	15 counties
  EG = "EG", // Egypt	27 governorates
  EH = "EH", // Western Sahara	—
  ER = "ER", // Eritrea	6 regions
  ES = "ES", // Spain	17 autonomous communities
  ET = "ET", // Ethiopia	2 administrations
  FI = "FI", // Finland	19 regions
  FJ = "FJ", // Fiji	4 divisions
  FK = "FK", // Falkland Islands (Malvinas)	—
  FM = "FM", // Micronesia (Federated States of)	4 states
  FO = "FO", // Faroe Islands	—
  FR = "FR", // France	12 metropolitan regions
  GA = "GA", // Gabon	9 provinces
  GB = "GB", // United Kingdom of Great Britain and Northern Ireland	32 council areas
  GD = "GD", // Grenada	6 parishes
  GE = "GE", // Georgia	2 autonomous republics
  GF = "GF", // French Guiana	—
  GG = "GG", // Guernsey	—
  GH = "GH", // Ghana	16 regions
  GI = "GI", // Gibraltar	—
  GL = "GL", // Greenland	5 municipalities
  GM = "GM", // Gambia	1 city
  GN = "GN", // Guinea	7 administrative regions
  GP = "GP", // Guadeloupe	—
  GQ = "GQ", // Equatorial Guinea	2 regions
  GR = "GR", // Greece	13 administrative regions
  GS = "GS", // South Georgia and the South Sandwich Islands	—
  GT = "GT", // Guatemala	22 departments
  GU = "GU", // Guam	—
  GW = "GW", // Guinea-Bissau	3 provinces
  GY = "GY", // Guyana	10 regions
  HK = "HK", // Hong Kong	—
  HM = "HM", // Heard Island and McDonald Islands	—
  HN = "HN", // Honduras	18 departments
  HR = "HR", // Croatia	1 city
  HT = "HT", // Haiti	10 departments
  HU = "HU", // Hungary	1 capital city
  ID = "ID", // Indonesia	7 geographical units
  IE = "IE", // Ireland	4 provinces
  IL = "IL", // Israel	6 districts
  IM = "IM", // Isle of Man	—
  IN = "IN", // India	28 states
  IO = "IO", // British Indian Ocean Territory	—
  IQ = "IQ", // Iraq	18 governorates
  IR = "IR", // Iran (Islamic Republic of)	31 provinces
  IS = "IS", // Iceland	8 regions
  IT = "IT", // Italy	15 regions
  JE = "JE", // Jersey	—
  JM = "JM", // Jamaica	14 parishes
  JO = "JO", // Jordan	12 governorates
  JP = "JP", // Japan	47 prefectures
  KE = "KE", // Kenya	47 counties
  KG = "KG", // Kyrgyzstan	2 cities
  KH = "KH", // Cambodia	1 autonomous municipality
  KI = "KI", // Kiribati	3 groups of islands
  KM = "KM", // Comoros	3 islands
  KN = "KN", // Saint Kitts and Nevis	2 states
  KP = "KP", // Korea (Democratic People's Republic of)	1 capital city
  KR = "KR", // Korea, Republic of	6 metropolitan cities
  KW = "KW", // Kuwait	6 governorates
  KY = "KY", // Cayman Islands	—
  KZ = "KZ", // Kazakhstan	3 cities
  LA = "LA", // Lao People's Democratic Republic	1 prefecture
  LB = "LB", // Lebanon	8 governorates
  LC = "LC", // Saint Lucia	10 districts
  LI = "LI", // Liechtenstein	11 communes
  LK = "LK", // Sri Lanka	9 provinces
  LR = "LR", // Liberia	15 counties
  LS = "LS", // Lesotho	10 districts
  LT = "LT", // Lithuania	10 counties
  LU = "LU", // Luxembourg	12 cantons
  LV = "LV", // Latvia	110 municipalities
  LY = "LY", // Libya	22 popularates
  MA = "MA", // Morocco	12 regions
  MC = "MC", // Monaco	17 quarters
  MD = "MD", // Moldova, Republic of	1 autonomous territorial unit
  ME = "ME", // Montenegro	24 municipalities
  MF = "MF", // Saint Martin (French part)	—
  MG = "MG", // Madagascar	6 provinces
  MH = "MH", // Marshall Islands	2 chains of islands
  MK = "MK", // North Macedonia	80 municipalities
  ML = "ML", // Mali	1 district
  MM = "MM", // Myanmar	7 regions
  MN = "MN", // Mongolia	1 capital city
  MO = "MO", // Macao	—
  MP = "MP", // Northern Mariana Islands	—
  MQ = "MQ", // Martinique	—
  MR = "MR", // Mauritania	15 regions
  MS = "MS", // Montserrat	—
  MT = "MT", // Malta	68 local councils
  MU = "MU", // Mauritius	3 dependencies
  MV = "MV", // Maldives	19 administrative atolls
  MW = "MW", // Malawi	3 regions
  MX = "MX", // Mexico	31 states
  MY = "MY", // Malaysia	3 federal territories
  MZ = "MZ", // Mozambique	1 city
  NA = "NA", // Namibia	14 regions
  NC = "NC", // New Caledonia	—
  NE = "NE", // Niger	1 urban community
  NF = "NF", // Norfolk Island	—
  NG = "NG", // Nigeria	1 capital territory
  NI = "NI", // Nicaragua	15 departments
  NL = "NL", // Netherlands[note 1]	12 provinces
  NO = "NO", // Norway	11 counties
  NP = "NP", // Nepal	5 development regions
  NR = "NR", // Nauru	14 districts
  NU = "NU", // Niue	—
  NZ = "NZ", // New Zealand	16 regions
  OM = "OM", // Oman	11 governorates
  PA = "PA", // Panama	10 provinces
  PE = "PE", // Peru	25 regions
  PF = "PF", // French Polynesia	—
  PG = "PG", // Papua New Guinea	1 district
  PH = "PH", // Philippines	17 regions
  PK = "PK", // Pakistan	4 provinces
  PL = "PL", // Poland	16 voivodships
  PM = "PM", // Saint Pierre and Miquelon	—
  PN = "PN", // Pitcairn	—
  PR = "PR", // Puerto Rico	—
  PS = "PS", // Palestine, State of	16 governorates
  PT = "PT", // Portugal	18 districts
  PW = "PW", // Palau	16 states
  PY = "PY", // Paraguay	1 capital
  QA = "QA", // Qatar	8 municipalities
  RE = "RE", // Réunion	—
  RO = "RO", // Romania	41 departments
  RS = "RS", // Serbia	2 autonomous provinces
  RU = "RU", // Russian Federation	21 republics
  RW = "RW", // Rwanda	1 town council
  SA = "SA", // Saudi Arabia	13 regions
  SB = "SB", // Solomon Islands	1 capital territory
  SC = "SC", // Seychelles	27 districts
  SD = "SD", // Sudan	18 states
  SE = "SE", // Sweden	21 counties
  SG = "SG", // Singapore	5 districts
  SH = "SH", // Saint Helena, Ascension and Tristan da Cunha	3 geographical entities
  SI = "SI", // Slovenia	212 municipalities
  SJ = "SJ", // Svalbard and Jan Mayen	—
  SK = "SK", // Slovakia	8 regions
  SL = "SL", // Sierra Leone	1 area
  SM = "SM", // San Marino	9 municipalities
  SN = "SN", // Senegal	14 regions
  SO = "SO", // Somalia	18 regions
  SR = "SR", // Suriname	10 districts
  SS = "SS", // South Sudan	10 states
  ST = "ST", // Sao Tome and Principe	1 autonomous region
  SV = "SV", // El Salvador	14 departments
  SX = "SX", // Sint Maarten (Dutch part)	—
  SY = "SY", // Syrian Arab Republic	14 provinces
  SZ = "SZ", // Eswatini	4 regions
  TC = "TC", // Turks and Caicos Islands	—
  TD = "TD", // Chad	23 provinces
  TF = "TF", // French Southern Territories	—
  TG = "TG", // Togo	5 regions
  TH = "TH", // Thailand	1 metropolitan administration
  TJ = "TJ", // Tajikistan	1 autonomous region
  TK = "TK", // Tokelau	—
  TL = "TL", // Timor-Leste	12 municipalities
  TM = "TM", // Turkmenistan	5 regions
  TN = "TN", // Tunisia	24 governorates
  TO = "TO", // Tonga	5 divisions
  TR = "TR", // Turkey	81 provinces
  TT = "TT", // Trinidad and Tobago	9 regions
  TV = "TV", // Tuvalu	1 town council
  TW = "TW", // Taiwan, Province of China[note 2]	13 counties
  TZ = "TZ", // Tanzania, United Republic of	31 regions
  UA = "UA", // Ukraine	24 regions
  UG = "UG", // Uganda	4 geographical regions
  UM = "UM", // United States Minor Outlying Islands	9 islands, groups of islands
  US = "US", // United States of America	50 states
  UY = "UY", // Uruguay	19 departments
  UZ = "UZ", // Uzbekistan	1 city
  VA = "VA", // Holy See	—
  VC = "VC", // Saint Vincent and the Grenadines	6 parishes
  VE = "VE", // Venezuela (Bolivarian Republic of)	1 federal dependency
  VG = "VG", // Virgin Islands (British)	—
  VI = "VI", // Virgin Islands (U.S.)	—
  VN = "VN", // Viet Nam	58 provinces
  VU = "VU", // Vanuatu	6 provinces
  WF = "WF", // Wallis and Futuna	3 administrative precincts
  WS = "WS", // Samoa	11 districts
  YE = "YE", // Yemen	1 municipality
  YT = "YT", // Mayotte	—
  ZA = "ZA", // South Africa	9 provinces
  ZM = "ZM", // Zambia	10 provinces
  ZW = "ZW", // Zimbabwe	10 provinces
}
