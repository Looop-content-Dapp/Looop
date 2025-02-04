import { useState, useEffect } from 'react';
import { FlutterwaveBank, UseBanksResult } from '../types/bank';
import { FlutterwaveService } from '../services/flutterwave';

export const useFlutterwaveBanks = (country: string): UseBanksResult => {
  const [banks, setBanks] = useState<FlutterwaveBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const banksList = await FlutterwaveService.getBanks(country);
      setBanks(banksList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [country]);

  return {
    banks,
    isLoading,
    error,
    refetch: fetchBanks
  };
};