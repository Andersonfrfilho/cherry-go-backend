interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

interface Tos_Accpetance {
  date: number;
  ip: string;
}

interface BankAccountOwnershipVerification {
  account_requirement: string;
}

interface Documents {
  bank_account_ownership_verification: BankAccountOwnershipVerification;
}

export interface UpdateAccountPaymentDTO {
  external_id: string;
  email?: string;
  name?: string;
  business_profile?: { support_phone?: string };
  company?: { address?: Address };
  tos_acceptance?: Tos_Accpetance;
  documents?: Documents;
  individual?: {
    verification?: {
      document?: {
        front?: string;
        details?: string;
      };
    };
  };
}
