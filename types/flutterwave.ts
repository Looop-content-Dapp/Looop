export interface FlutterwaveConfig {
  publicKey: string;
  encryptionKey?: string;
  currency?: string;
}

export interface CardPaymentData {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  currency: string;
  amount: string;
  email: string;
  fullname: string;
  tx_ref: string;
  redirect_url: string;
}

export interface TransactionResponse {
  status: 'successful' | 'failed' | 'pending';
  transaction_id?: string;
  error?: string;
}