import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// Simplified location info focusing on country/region data
interface LocationInfo {
  coords: {
    latitude: number;
    longitude: number;
  };
  country: string;
  city: string;
  region: string;
}

// Essential device info for app performance and audio capabilities
interface DeviceInfo {
  brand: string | null;
  modelName: string | null;
  osName: Device.DeviceType;
  osVersion: string;
  isDevice: boolean;
  platformOs: string;
}

// Network info critical for streaming quality
interface NetworkInfo {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: NetInfoState['type'];
  isWifi: boolean;
  isCellular: boolean;
}

// Basic locale info for content localization
interface LocaleInfo {
  locale: string;
  region: string | null;
  isRTL: boolean;
}

interface UserInfo {
  location: LocationInfo | null;
  device: DeviceInfo | null;
  network: NetworkInfo | null;
  locale: LocaleInfo | null;
  loading: boolean;
  error: string | null;
}

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    location: null,
    device: null,
    network: null,
    locale: null,
    loading: true,
    error: null
  });

  const getLocationInfo = async (): Promise<LocationInfo> => {
    try {
      const { status } = await Location?.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const [geocodeResult] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (!geocodeResult) {
        throw new Error('Failed to get location details');
      }

      return {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        country: geocodeResult.country || '',
        city: geocodeResult.city || '',
        region: geocodeResult.region || ''
      };
    } catch (error) {
      throw new Error(`Location error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getDeviceInfo = async (): Promise<DeviceInfo> => {
    return {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion as string,
      isDevice: Device.isDevice,
      platformOs: Platform.OS
    };
  };

  const getNetworkInfo = async (): Promise<NetworkInfo> => {
    try {
      const networkState = await NetInfo.fetch();

      return {
        isConnected: networkState.isConnected,
        isInternetReachable: networkState.isInternetReachable,
        type: networkState.type,
        isWifi: networkState.type === 'wifi',
        isCellular: networkState.type === 'cellular'
      };
    } catch (error) {
      throw new Error(`Network info error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getLocaleInfo = (): LocaleInfo => {
    return {
      locale: Localization.locale,
      region: Localization.region,
      isRTL: Localization.isRTL
    };
  };

  const getAllUserInfo = async (): Promise<void> => {
    try {
      const [location, device, network] = await Promise.all([
        getLocationInfo(),
        getDeviceInfo(),
        getNetworkInfo()
      ]);

      const locale = getLocaleInfo();

      setUserInfo({
        location,
        device,
        network,
        locale,
        loading: false,
        error: null
      });
    } catch (error) {
      setUserInfo(prev => ({
        ...prev,
        loading: false,
        // error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeUserInfo = async () => {
      if (mounted) {
        await getAllUserInfo();
      }
    };

    initializeUserInfo();

    // Monitor network status for streaming quality
    const unsubscribe = NetInfo.addEventListener(state => {
      if (mounted) {
        setUserInfo(prev => ({
          ...prev,
          network: {
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
            isWifi: state.type === 'wifi',
            isCellular: state.type === 'cellular'
          }
        }));
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUserInfo = async (): Promise<void> => {
    setUserInfo(prev => ({ ...prev, loading: true, error: null }));
    await getAllUserInfo();
  };

  return {
    ...userInfo,
    refreshUserInfo
  };
};

export default useUserInfo;
