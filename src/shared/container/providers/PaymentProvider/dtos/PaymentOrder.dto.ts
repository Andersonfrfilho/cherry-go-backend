export interface PaymentCard {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
}
export interface PaymentOrderDTO {
  order_stripe_id: string;
  card: PaymentCard;
}
