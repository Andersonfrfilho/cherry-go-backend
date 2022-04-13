import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { GENDERS_ENUM } from "@modules/accounts/enums/GendersUsers.enum";
import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/LocalsTypes.enum";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums";

export interface ServiceFormattedModalService extends Services {
  select: boolean;
  expand: boolean;
}

export enum TransportTypeProviderEnum {
  client = "client",
  provider = "provider",
  uber = "uber",
}
type ProviderDaysAvailability = {
  id: string;
  day: DAYS_WEEK_ENUM;
  provider_id: string;
};
export type ProviderHoursAvailability = {
  id: string;
  start_time: string;
  end_time: string;
  provider_id: string;
};
type Term = {
  id: string;
  accept: boolean;
  type: string;
};

type User_Type = {
  id: string;
  user_id: string;
  user_type_id: string;
  active: boolean;
  roles: string[];
  permissions: string[];
  user_type: {
    id: string;
    name: string;
    description: null | any;
  };
};

type Image = {
  id: string;
  link: string;
};

type Image_Profile = {
  id: string;
  user_id: string;
  image_id: string;
  position: string;
  rating: string;
  created_at: string;
  image: Image;
};

export type Phone = {
  country_code: string;
  ddd: string;
  number: string;
  id: string;
};

export type Addresses = {
  street: string;
  number: string;
  zipcode: string;
  district: string;
  city: string;
  state: string;
  country: string;
  id: string;
  complement?: string;
  reference?: string;
  latitude?: string;
  longitude?: string;
};
type AddressesAppointment = {
  id: string;
  appointment_id: string;
  address_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  address: Addresses;
};
export type TransportType = {
  id: string;
  name: string;
  description?: any;
  active: boolean;
};
export type ProviderTransportTypes = {
  id: string;
  provider_id: string;
  transport_type_id: string;
  details?: any;
  name: TransportTypeProviderEnum;
  description?: string;
  amount?: number;
  active: boolean;
  created_at: string;
  transport_type: TransportType;
};

type Transport = {
  id: string;
  provider_id: string;
  appointment_id: string;
  amount: string;
  transport_type_id: string;
  origin_address_id: string;
  destination_address_id: string;
  confirm: true;
  initial_hour: string;
  departure_time: string;
  arrival_time_destination: string;
  arrival_time_return: string;
  return_time: string;
  created_at: string;
  transport_type: TransportType;
  origin_address: Addresses;
  destination_address: Addresses;
};
type Service = {
  id: string;
  provider_id: string;
  appointment_id: string;
  name: string;
  service_id: string;
  created_at: string;
  active: boolean;
  amount: string;
  duration: string;
};

type ElementTransactionItem = {
  id: string;
  provider_id: string;
  name: string;
  service_id: string;
  created_at: string;
  active: boolean;
  amount: string;
  duration: string;
};

type TransactionItem = {
  id: string;
  transaction_id: string;
  elements: ElementTransactionItem;
  reference_key: string;
  type: string;
  increment_amount: string;
  discount_amount: string;
  amount: string;
  created_at: string;
};

type Transaction = {
  id: string;
  current_amount: string;
  original_amount: string;
  discount_amount: string;
  increment_amount: string;
  status: string;
  client_id: string;
  appointment_id: string;
  created_at: string;
  updated_at: string;
  itens: TransactionItem[];
};
interface Address {
  external_id: string;
  street: string;
  number: string;
  zipcode: string;
  district: string;
  city: string;
  state: string;
  country: string;
  longitude?: string;
  latitude?: string;
  complement?: string;
  reference?: string;
}

interface UserType {
  id: string;
  name: USER_TYPES_ENUM;
  description: string | null;
}

interface Type {
  id: string;
  user_id: string;
  user_type_id: string;
  active: boolean;
  roles: string[];
  permissions: string[];
  user_type: UserType;
}

interface ImageProfile {
  external_id: string;
  link: string;
}

export interface UserClient {
  id: string;
  user_id: string;
  name: string;
  last_name: string;
  birth_date: string;
  cpf: string;
  rg: string;
  gender: GENDERS_ENUM;
  email: string;
  active: boolean;
  details: any;
  types: Type[];
  phones: Phone;
  addresses: Address;
  image_profile: ImageProfile[];
  terms: Term[];
  token: string;
  refresh_token: string;
}

export type ClientAppointment = {
  id: string;
  client_id: string;
  appointment_id: string;
  active: boolean;
  created_at: string;
  updated_at: null;
  deleted_at: null;
  client: UserClient;
};

export type Appointment = {
  id: string;
  initial_date: string;
  final_date: string;
  confirm: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  providers: UserProvider[];
  clients: ClientAppointment[];
  transports: Transport[];
  services?: Service[];
  addresses: AddressesAppointment[];
  transactions: Transaction[];
};
export type AppointmentsMode = {
  opens: Appointment[];
  rejected: Appointment[];
  confirmed: Appointment[];
};
export type Image_Provider = {
  id: string;
  provider_id: string;
  image_id: string;
  position: string;
  rating: string;
  created_at: string;
  updated_at: null;
  deleted_at: null;
  image: Image;
};
type Payment = {
  id: string;
  name: PAYMENT_TYPES_ENUM;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: null;
  deleted_at: null;
};

type PaymentType = {
  id: string;
  provider_id: string;
  payment_type_id: string;
  active: boolean;
  payment: Payment;
};
interface DataBank {
  name: string;
  id: string;
}

interface StripeAccount {
  id: string;
  bank_accounts: Array<DataBank>;
}
interface Stripe {
  account: StripeAccount;
  customer: StripeAccount;
}

export interface Details {
  stripe?: Stripe;
  fantasy_name?: string;
  color_hair?: string;
  nuance_hair?: string;
  style_hair?: string;
  height?: number;
  weight?: number;
  description?: string;
  ethnicity?: string;
  color_eye?: string;
}
export type LocalType = {
  id: string;
  provider_id: string;
  local_type: LOCALS_TYPES_ENUM;
  active: boolean;
};
export type Local = {
  id: string;
  provider_id: string;
  address_id: string;
  active: boolean;
  amount: string;
  details: null;
  address: Addresses;
};
type Tag = {
  id: string;
  name: string;
  description?: null;
  image: Image;
};
export type Services = {
  id: string;
  name: string;
  amount: number;
  duration: number;
  active: boolean;
  details?: null | any;
  provider_id: string;
  tags: Tag[];
};

export type UserProvider = {
  id: string;
  name: string;
  last_name: string;
  cpf: string;
  rg: string;
  email: string;
  active: boolean;
  password?: string;
  password_confirm?: string;
  birth_date: string;
  status: string;
  gender: GENDERS_ENUM;
  details?: Details;
  phones?: Phone[];
  addresses?: Addresses[];
  types?: User_Type[];
  term?: Term[];
  locals?: Local[];
  locals_types: LocalType[];
  transports_types?: ProviderTransportTypes[];
  image_profile?: Image_Profile[];
  transactions?: Transaction[];
  token?: string;
  appointments?: AppointmentsMode;
  refresh_token?: string;
  images?: Image_Provider[];
  days?: ProviderDaysAvailability[];
  hours?: ProviderHoursAvailability[];
  payments_types?: PaymentType[];
  services?: Services[];
  ratings?: number;
  favorite?: boolean;
};
