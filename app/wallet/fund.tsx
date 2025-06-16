import { View, Text, TouchableOpacity, Image, SafeAreaView, StyleSheet, Platform, Linking } from "react-native";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useAppSelector } from "@/redux/hooks";
import { ArrowRight01Icon, BankIcon } from "@hugeicons/react-native";
import { startOnrampSDK, onRampSDKNativeEvent, closeOnrampSDK } from '@onramp.money/onramp-react-native-sdk';
import { WebView } from 'react-native-webview';

const FundWalletScreen = () => {
  const navigation = useNavigation();
  const [selectedChain, setSelectedChain] = useState('Starknet');
  const { userdata } = useAppSelector(state => state.auth);
  const [webviewVisible, setWebviewVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isOnrampVisible, setIsOnrampVisible] = useState(false);

  const WIDGET_ID = 'YOUR_WIDGET_ID'; // Replace with your Kado widget ID

  useEffect(() => {
    const onRampEventListener = onRampSDKNativeEvent.addListener(
      'widgetEvents',
      eventData => {
        console.log('Received onRampEvent:', eventData);
        // Handle different events
        switch(eventData.type) {
          case 'ONRAMP_WIDGET_TX_COMPLETED':
            setIsOnrampVisible(false);
            // Handle successful transaction
            break;
          case 'ONRAMP_WIDGET_CLOSE_REQUEST_CONFIRMED':
            setIsOnrampVisible(false);
            break;
        }
      },
    );

    return () => {
      onRampEventListener.remove();
      if (isOnrampVisible) {
        closeOnrampSDK();
      }
    };
  }, [isOnrampVisible]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Fund Wallet" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const handleStablecoinFunding = () => {
    router.push({
      pathname: "/wallet/stablecoinFunding",
      params: {
        // chain: selectedChain, // Not needed as stablecoinFunding now defaults to Starknet
        address: userdata?.wallets?.starknet?.address
      }
    });
  };

  const handleBankTransfer = () => {
    const walletAddress = userdata?.wallets?.starknet?.address;

    startOnrampSDK({
      appId: 1, // Replace with your actual appID
      walletAddress: walletAddress || undefined, // Ensure it's string or undefined
      flowType: 1, // Onramp
      fiatType: 2, // USD
      paymentMethod: 2, // Bank transfer
      network: 'STARKNET',
    });

    setIsOnrampVisible(true);
  };

  if (webviewVisible && currentUrl) {
    return (
      <>
        <WebView
          containerStyle={styles.modalContainer}
          onMessage={(event) => {
            const eventData = event?.nativeEvent?.data;
            try {
              const message = JSON.parse(eventData);
              console.log('Post Message Logs', message);
              if (message?.type === 'PLAID_NEW_ACH_LINK') {
                const achLink = message?.payload?.link;
                Linking.openURL(achLink);
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }}
          allowUniversalAccessFromFileURLs
          geolocationEnabled
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          source={{ uri: currentUrl }}
          allowsBackForwardNavigationGestures
          onError={(e) => {
            console.warn('error occurred', e);
          }}
          style={styles.webview}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setWebviewVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="px-6 mt-6">
        <View className="flex-row items-center justify-between px-[16px]">
        <Text className="text-[24px] font-PlusJakartaSansBold text-white mb-2">
          Top up USD
        </Text>
        {/* Chain selection removed as only Starknet is supported now */}
        </View>


        {/* Add via stablecoins */}
        <TouchableOpacity
          onPress={handleStablecoinFunding}
          className="bg-[#111318] p-4 rounded-[10px] mb-4 flex-row items-center"
        >
          <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
            <Image
              source={require("@/assets/images/usdc-icon.png")}
              className="w-6 h-6"
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-[16px] text-white font-PlusJakartaSansBold">
                Add via stablecoins
              </Text>
              <View className="ml-2 bg-[#FF6D1B20] px-2 py-1 rounded">
                <Text className="text-[#FF6D1B] text-[12px] font-PlusJakartaSansMedium">
                  NEW
                </Text>
              </View>
            </View>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Fund your US balance with USDC. Arrives in 1-5 mins
            </Text>
          </View>
          <ArrowRight01Icon size={24} color="#787A80" />
        </TouchableOpacity>

        {/* Add via bank transfer */}
        {/* <TouchableOpacity
          onPress={handleBankTransfer}
          className="bg-[#111318] p-4 rounded-[10px] flex-row items-center"
        >
          <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
           <BankIcon size={24} color="#FF6D1B" variant="solid" />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] text-white font-PlusJakartaSansBold">
              Add via Credit/Debit Card
            </Text>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Fund your account through credit or debit card.
            </Text>
          </View>
          <ArrowRight01Icon size={24} color="#787A80" />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: Platform.OS === 'ios' ? 45 : 0,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FundWalletScreen;
