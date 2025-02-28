// components/TransactionHistory.tsx
import { View, Text, FlatList } from "react-native";

type Transaction = {
  title: string;
  amount: string;
  date: string;
  source: string;
};

type TransactionHistoryProps = {
  transactions: Transaction[];
};

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View className="flex-row justify-between px-4 py-4 bg-[#111318] mb-[16px] border-b border-[#12141B]">
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
              item.amount.startsWith("+") ? "text-[#45F42E]" : "text-[#FF5454]"
            }`}>
              {item.amount}
            </Text>
            <Text className="text-[#63656B] text-[12px] font-PlusJakartaSansMedium">
              {item.date}
            </Text>
          </View>
        </View>
      )}
    />
  );
}
