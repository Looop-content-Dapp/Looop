export type TransactionMetadata = {
  communityId?: string;
  communityName?: string;
  passId?: string;
};

export type Transaction = {
  _id: string;
  userId: string;
  referenceId?: string;
  amount: number;
  currency: string;
  usdcEquivalent?: number;
  transactionHash?: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: 'card' | 'applepay' | 'wallet';
  type: 'funding' | 'mint_pass' | 'transfer';
  source: 'card' | 'applepay' | 'wallet';
  blockchain: 'Starknet' | 'XION';
  title?: string;
  message?: string;
  data?: TransactionMetadata;
  createdAt: string;
};

export type TransactionQueryParams = {
  type?: Transaction['type'];
  page?: number;
  limit?: number;
};
