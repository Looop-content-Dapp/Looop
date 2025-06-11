import { useCallback } from 'react';
import { Platform } from 'react-native';

export type Currency = 'USD' | 'NGN' | 'GHS' | 'ZAR' | 'KES' | 'XOF' | 'RWF';

interface PaymentConfig {
  amount: number;
  customerEmail: string;
  customerName: string;
  customerId: string;
  txRef: string;
}

interface ApplePayConfig {
  amount: number;
  customerEmail: string;
  merchantIdentifier: string;
  countryCode: string;
}

import axios from 'axios';

const FLUTTERWAVE_API = {
  baseUrl: 'https://api.flutterwave.com/v3',
  secretKey: process.env.EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY,
};


interface MetaObject {
  device_fingerprint?: string;
  client_ip?: string;
  eci?: string;
  a_authenticationtoken?: string;
  a_amount?: string;
  a_version?: string;
  a_transactionid?: string;
  a_transactionstatus?: string;
  a_statusreasoncode?: string;
  is_custom_3ds_enabled?: boolean;
  a_time?: string;
}

interface AuthorizationObject {
  preauthorize?: boolean;
  card_holder_name?: string;
  phone_number?: string;
  payment_plan?: string;
}

interface CardPaymentPayload {
  amount: string;
  currency: Currency;
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  email: string;
  tx_ref: string;
  fullname: string;
  redirect_url: string;
  authorization?: AuthorizationObject;
  meta?: MetaObject;
}

interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    processor_response: string;
    auth_model: string;
    auth_url?: string;
  };
}

interface ValidatePaymentPayload {
  otp: string;
  flw_ref: string;
  type: 'card';
}

interface PreAuthPayload {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  currency: string;
  amount: string;
  email: string;
  fullname: string;
}

export const useFlutterwavePayment = () => {
  const api = axios.create({
    baseURL: FLUTTERWAVE_API.baseUrl,
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const preAuthenticateCard = async (payload: PreAuthPayload) => {
    try {
      // Ensure all required fields are properly formatted
      const formattedPayload = {
        ...payload,
        amount: payload.amount.toString(),
        expiry_month: payload.expiry_month.padStart(2, '0'),
        expiry_year: payload.expiry_year.length === 2 ? payload.expiry_year : payload.expiry_year.slice(-2),
        client: 'api',
        tx_ref: `TX-${Date.now()}`,
        redirect_url: 'https://webhook.site/redirect-url',
        // Remove enckey as it's not needed in the payload
        payment_type: 'card'
      };
      
      const response = await api.post<FlutterwaveResponse>(
        '/charges?type=card',
        formattedPayload,
        {
          headers: {
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('Response:', response.data); // Add this for debugging
      
      if (!response.data || response.data.status === 'error') {
        throw new Error(response.data?.message || 'Pre-authentication failed');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Pre-authentication failed';
        console.error('Pre-auth Error:', errorMessage, error.response?.data);
        throw new Error(errorMessage);
      }
      throw error;
    }
  };


  const initiateCardPayment = async (payload: CardPaymentPayload) => {
    try {
      // First attempt pre-authentication
      await preAuthenticateCard({
        card_number: payload.card_number,
        cvv: payload.cvv,
        expiry_month: payload.expiry_month,
        expiry_year: payload.expiry_year,
        currency: payload.currency,
        amount: payload.amount,
        email: payload.email,
        fullname: payload.fullname,
      });

      // If pre-auth succeeds, proceed with payment
      const response = await api.post<FlutterwaveResponse>(
        '/charges?type=card',
        {
          ...payload,
          client: 'api'
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Payment initiation failed');
      }
      throw error;
    }
  };

  const validatePayment = async (payload: ValidatePaymentPayload) => {
    try {
      const response = await api.post<FlutterwaveResponse>(
        '/validate-charge',
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Payment validation failed');
      }
      throw error;
    }
  };

  const verifyTransaction = async (transactionId: string) => {
    try {
      const response = await api.get<FlutterwaveResponse>(
        `/transactions/${transactionId}/verify`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Transaction verification failed');
      }
      throw error;
    }
  };

  return {
    preAuthenticateCard,
    initiateCardPayment,
    validatePayment,
    verifyTransaction,
  };
};

export const usePayment = () => {
  const handleOnRedirect = useCallback((data: any) => {
    try {
      // Ensure data exists to prevent undefined access
      if (!data) {
        console.log('No payment data received');
        return;
      }

      // Handle different payment status scenarios
      switch (data.status?.toLowerCase()) {
        case 'cancelled':
        case 'failed':
        case 'closed':
          console.log('Payment was cancelled or closed');
          // Ensure we're properly handling the modal closure
          if (data.close) {
            data.close();
          }
          return;
        case 'successful':
          console.log('Payment successful:', data);
          break;
        default:
          // Handle any other status gracefully
          console.log('Payment status:', data.status || 'unknown');
          return;
      }
    } catch (error) {
      console.log('Payment error:', error);
      // Ensure we don't propagate the error
      return false;
    }
  }, []);

  const initializeFlutterwavePayment = ({
    amount,
    customerEmail,
    customerName,
    customerId,
    txRef,
  }: PaymentConfig) => {
    const paymentOptions = {
      tx_ref: txRef,
      authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY as string,
      customer: {
        email: customerEmail,
        name: customerName,
        phonenumber: '',
      },
      amount: amount,
      currency: 'USD' as Currency,
      payment_options: 'card',
      customizations: {
        title: 'Looop Tribe Pass',
        description: 'Payment for Tribe Pass',
        logo: 'https://your-logo-url.png',
      },
    };
    return {
      paymentOptions,
      handleOnRedirect,
    };
  };

  // Apple Pay initialization
  const initializeApplePay = ({
    amount,
    customerEmail,
    merchantIdentifier,
    countryCode,
  }: ApplePayConfig) => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Pay is only available on iOS devices');
    }

    const paymentRequest = {
      merchantIdentifier,
      supportedNetworks: ['visa', 'mastercard', 'amex'],
      countryCode,
      currencyCode: 'USD',
      paymentSummaryItems: [
        {
          label: 'Looop Tribe Pass',
          amount: amount.toString(),
        },
      ],
      shippingContact: {
        emailAddress: customerEmail,
      },
    };

    return {
      paymentRequest,
      handleOnRedirect,
    };
  };

  return {
    initializeFlutterwavePayment,
    initializeApplePay,
  };
};