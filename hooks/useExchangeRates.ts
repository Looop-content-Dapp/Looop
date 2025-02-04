import { useState, useEffect } from 'react';

interface ExchangeRate {
  rate: number;
  symbol: string;
}

interface ExchangeRates {
  [key: string]: ExchangeRate;
}

const FLUTTERWAVE_API_KEY = process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY; // Move to env file

export const useExchangeRates = (baseCurrency: string = 'USD') => {
  const [rates, setRates] = useState<ExchangeRates>({
    US: { symbol: '$', rate: 1 },
    NG: { symbol: '₦', rate: 1 },
    UK: { symbol: '£', rate: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all([
          fetch('https://api.flutterwave.com/v3/rates?from=USD&to=NGN', {
            headers: {
              'Authorization': `Bearer ${FLUTTERWAVE_API_KEY}`,
            }
          }),
          fetch('https://api.flutterwave.com/v3/rates?from=USD&to=GBP', {
            headers: {
              'Authorization': `Bearer ${FLUTTERWAVE_API_KEY}`,
            }
          })
        ]);

        const [ngnData, gbpData] = await Promise.all(
          responses.map(response => {
            if (!response.ok) {
              throw new Error('Rate fetch failed');
            }
            return response.json();
          })
        );

        setRates({
          US: { symbol: '$', rate: 1 },
          NG: { symbol: '₦', rate: ngnData.data.rate },
          UK: { symbol: '£', rate: gbpData.data.rate },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
        // Fallback to default rates
        setRates({
          US: { symbol: '$', rate: 1 },
          NG: { symbol: '₦', rate: 815.50 },
          UK: { symbol: '£', rate: 0.79 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    // Refresh rates every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { rates, loading, error };
};