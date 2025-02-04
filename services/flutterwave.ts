import { FlutterwaveBank } from "@/types/bank";

const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3';

export class FlutterwaveService {
  private static headers = {
    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_FLUTTERWAVE_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  static async getBanks(country: string): Promise<FlutterwaveBank[]> {
    try {
      const response = await fetch(
        `${FLUTTERWAVE_API_URL}/banks/${country}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch banks');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error instanceof Error 
        ? error 
        : new Error('An error occurred while fetching banks');
    }
  }
}