import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { router } from 'expo-router';

// Update Transaction type to include status
type Transaction = {
  title: string;
  amount: string;
  date: string;
  source: string;
  status: 'success' | 'failed';
};

  type TransactionHistoryProps = {
    transactions: Transaction[];
    isLoading?: boolean;
  };

export default function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
    if (isLoading) {
        return (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF8A49" />
          </View>
        );
      }

  if (!transactions || transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#FFFFFF] text-[16px] font-PlusJakartaSansRegular mb-2">
          No transactions yet
        </Text>
        <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium text-center px-4">
          Perform a transaction to see your transaction history
        </Text>
      </View>
    );
  }

  const handleTransactionPress = (transactionId: string) => {
    router.push({
      pathname: "/wallet/transaction-details",
      params: { id: transactionId }
    });
  };

  return (
    <FlatList
      data={transactions}
      scrollEnabled={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleTransactionPress(item.id)}
          className="flex-row justify-between px-4 py-4 bg-[#202227] rounded-[10px] mb-[16px] border-b border-[#12141B]"
        >
          <View className="">
            <Text className="text-[#FFFFFF] text-[16px] font-PlusJakartaSansRegular mb-1">
              {item.title}
            </Text>
            <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium">
              {item.source}
            </Text>
          </View>
          <View className="items-end">
            <Text className={`text-[16px] font-PlusJakartaSansBold ${
              item.status === 'failed' ? 'text-[#FF5454]' :
              item.amount.startsWith("+") ? "text-[#45F42E]" : "text-[#FF5454]"
            }`}>
              {item.status === 'failed' ? 'Failed' : item.amount}
            </Text>
            <Text className="text-[#63656B] text-[12px] font-PlusJakartaSansMedium">
              {item.date}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}
