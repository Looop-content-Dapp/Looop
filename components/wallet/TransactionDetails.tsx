import React, { useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Share, Platform, Image } from 'react-native';
import { useTransactionDetails } from '@/hooks/payment/useTransaction';
import { Copy01Icon, Share01Icon, MessageQuestionIcon } from '@hugeicons/react-native';
import * as Clipboard from 'expo-clipboard';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'expo-router';

type TransactionDetailsProps = {
  transactionId: string;
};

// Add ViewShot type
type ViewShotType = React.ComponentType<any> & {
  capture: () => Promise<string>;
};

type ViewShotRefType = {
    capture: () => Promise<string>;
  } & React.Component;


export default function TransactionDetails({ transactionId }: TransactionDetailsProps) {
  const navigation = useRouter();
  // Update the ref type
  const { showNotification } = useNotification()
  const viewShotRef = useRef<ViewShotRefType>(null);
  const { data: response, isLoading } = useTransactionDetails(transactionId);
  const transaction = response?.metadata;

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showNotification({
      message: 'Copied to clipboard',
      type: 'success',
      title: "Success",
      position: "top"
    })
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatUSDC = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(amount / 1000000); // Divide by 10^6 to convert from base units
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 0.9
        });

        if (Platform.OS === 'ios') {
          await Share.share({
            url: uri,
            title: `Transaction Details - ${transaction.referenceId || transaction.transactionHash}`,
          });
        } else {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share Transaction Details',
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContactSupport = () => {
    // navigation.navigate('Support', {
    //   transactionId,
    //   referenceId: transaction.referenceId,
    //   transactionHash: transaction.transactionHash
    // });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A49" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#FFFFFF] text-[16px]">Transaction not found</Text>
      </View>
    );
  }

  const formatLongString = (str: string) => {
    if (!str) return '';
    const start = str.slice(0, 6);
    const end = str.slice(-4);
    return `${start}...${end}`;
  };

  const DetailRow = ({ label, value, copyable = false }) => (
    <View className="flex-row justify-between py-[16px]">
      <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium">
        {label}
      </Text>
      <View className="flex-row items-center">
        <Text className="text-[#FFFFFF] text-[14px] font-PlusJakartaSansMedium mr-2">
          {copyable ? formatLongString(value) : value}
        </Text>
        {copyable && (
          <Pressable onPress={() => copyToClipboard(value)}>
            <Copy01Icon size={18} color="#787A80" />
          </Pressable>
        )}
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-[#45F42E]';
      case 'failed': return 'text-[#FF5454]';
      default: return 'text-[#FF8A49]'; // pending
    }
  };

  return (
    <ScrollView className="flex-1 px-4">
           <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={{ backgroundColor: '#040405' }}>
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Image
                source={require('@/assets/images/logo-orange.png')}
                className="w-[60px] h-[20px]"
                resizeMode="contain"
              />
            </View>
      <View className="mt-6 mb-8">
      {transaction.title && (
          <Text className="text-[#FFFFFF] text-[14px] font-PlusJakartaSansMedium text-center mt-2">
            {transaction.title}
          </Text>
        )}
        <Text className="text-[#FFFFFF] text-[32px] font-PlusJakartaSansBold text-center">
        ≈ ${formatUSDC(transaction.amount)} {transaction.currency}
        </Text>
        <Text className={`text-center text-[16px] font-PlusJakartaSansBold mt-2 ${getStatusColor(transaction.status)}`}>
          {transaction.status.toUpperCase()}
        </Text>

        {transaction.message && (
          <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium text-center mt-1">
            {transaction.message}
          </Text>
        )}
      </View>

      <View className="rounded-xl p-4">
        <DetailRow label="Date and Time" value={new Date(transaction.createdAt).toLocaleString()} />
        <DetailRow label="Transaction Type" value={transaction.type.replace('_', ' ').toUpperCase()} />
        <DetailRow label="Amount" value={`${formatUSDC(transaction.amount)} ${transaction.currency}`} />
        {transaction.usdcEquivalent && (
          <DetailRow label="USDC Equivalent" value={`$${transaction.usdcEquivalent}`} />
        )}
        <DetailRow label="Payment Method" value={transaction.paymentMethod.toUpperCase()} />
        <DetailRow label="Source" value={transaction.source.toUpperCase()} />
        <DetailRow label="Blockchain" value={transaction.blockchain} />

        {transaction.metadata?.communityId && (
          <DetailRow label="Community" value={transaction.metadata.communityId} copyable={true} />
        )}

        {transaction.transactionHash && (
          <DetailRow
            label="Transaction Hash"
            value={transaction.transactionHash}
            copyable={true}
          />
        )}
        {transaction.referenceId && (
          <DetailRow
            label="Reference ID"
            value={transaction.referenceId}
            copyable={true}
          />
        )}
      </View>

      <View className="px-4 py-4 border-t border-[#2C2C2E]">
        {transaction.status === 'failed' && (
          <Pressable
            onPress={handleContactSupport}
            className="bg-[#2C2C2E] gap-x-4 rounded-[56px] py-4 flex-row items-center justify-center mb-4"
          >
            <MessageQuestionIcon size={24} color="#FFFFFF" className="mr-2" />
            <Text className="text-[#FFFFFF] text-[16px] font-PlusJakartaSansMedium">
              Contact Support
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleShare}
          className="bg-Orange/08 rounded-[56px] gap-x-4 py-4 flex-row items-center justify-center"
        >
          <Share01Icon size={24} color="#040405" className="mr-2" />
          <Text className="text-[#040405] text-[16px] font-PlusJakartaSansMedium">
            Share Transaction
          </Text>
        </Pressable>
      </View>
      </ViewShot>
    </ScrollView>
  );
}
