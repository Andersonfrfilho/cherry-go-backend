interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface UpdateAccountClientPaymentDTO {
  external_id: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: Address;
}
