import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the types for the parameters
export const setItem = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Error storing value', error)
    }
}

export const getItem = async (key: string): Promise<string | null> => {
   try {
    const value = await AsyncStorage.getItem(key);
    return value;
   } catch (error) {
    console.log('Error getting value', error);
    return null;
   }
}

export const removeItem = async (key: string): Promise<void> => {
    try {
     await AsyncStorage.removeItem(key);
    } catch (error) {
     console.log('Error removing value', error);
    }
}
