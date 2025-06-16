import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";
import PayWithCard from "@/components/bottomSheet/payWithCard";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import WalletBalance from "@/components/wallet/WalletBalance";
import { useTransaction } from "@/hooks/payment/useTransaction";
import { useWalletBalance } from "@/hooks/payment/useWalletBalance";
import { useAppSelector } from "@/redux/hooks";
import {
  ArrowRight01Icon,
  CreditCardIcon,
  Search01Icon,
} from "@hugeicons/react-native";
import * as Clipboard from "expo-clipboard";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

// Update APITransaction type to match the actual API response
type APITransaction = {
  _id: string;
  title: string;
  type: "funding" | "withdrawal" | "mint_pass" | "transfer";
  amount: number;
  currency: string;
  createdAt: string;
  source: "card" | "wallet" | "applepay";
  status: "success" | "failed";
  message?: string;
};

type Transaction = {
  title: string;
  amount: string;
  date: string;
  source: "card" | "wallet" | "applepay"; // Updated to match APITransaction source types
};

type WalletData = {
  balances: {
    xion: number;
    starknet: number;
    total: number;
  };
  addresses: Array<{
    chain: string;
    address: string;
  }>;
  transactions: Transaction[];
};

const WalletScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Balances");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");
  const [isLoading, setIsLoading] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const { data: walletBalanceData, isLoading: loading } = useWalletBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransaction(
    userdata?._id || ""
  );
  const filterOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "All time",
  ];
  const router = useRouter();

  const [walletData, setWalletData] = useState<WalletData>({
    balances: {
      xion: 0,
      starknet: 0,
      total: 0,
    },
    addresses: [
      { chain: "XION", address: `${userdata?.wallets?.xion?.address || ""}` },
      {
        chain: "Starknet",
        address: `${userdata?.wallets?.starknet?.address || ""}`,
      },
    ],
    transactions: [], // Now properly typed as Transaction[]
  });

  // Set navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton name="Wallet" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);
  console.log(walletData, "transaction");

  // Update walletData when transactions are loaded
  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {

      setWalletData((prev) => ({
        ...prev,
        transactions: transactions.map((tx: APITransaction) => ({
          id: tx?._id,
          title: tx?.title || tx?.type || "",
          amount: `${["funding", "transfer"].includes(tx.type) ? "+" : "-"}${
            tx?.amount || 0
          } ${tx?.currency || ""}`,
          date: tx?.createdAt
            ? new Date(tx.createdAt).toLocaleDateString()
            : "",
          source: tx?.source || "wallet",
        })),
      }));
    }
  }, [transactions]);

  // Update the useEffect for transaction mapping
  useEffect(() => {
    if (transactions?.success && transactions?.data?.transactions) {
      setWalletData((prev) => ({
        ...prev,
        transactions: transactions.data.transactions.map(
          (tx: APITransaction) => ({
            id: tx?._id,
            title: tx.title || tx.type,
            amount: `${
              tx.status === "failed" ? "" : tx.type === "funding" ? "+" : "-"
            }${tx.amount / 1000000} ${tx.currency}`,
            date: new Date(tx.createdAt).toLocaleDateString(),
            source: tx.source,
            status: tx.status, // Add status to be used in TransactionHistory
          })
        ),
      }));
    }
  }, [transactions]);

  // Fetch wallet balances
  useEffect(() => {
    if (walletBalanceData) {
      console.log("walletBalanceData", walletBalanceData);
      const xionBalance =
        walletBalanceData?.data?.xion?.balances?.[0]?.usdValue ?? 0;
      const starknetBalance =
        walletBalanceData?.data?.starknet?.usdValue ?? 0;

      setWalletData((prev) => ({
        ...prev,
        balances: {
          xion: xionBalance,
          starknet: starknetBalance,
          total: xionBalance + starknetBalance,
        },
      }));
    }
  }, [walletBalanceData]);

  const handleTabPress = (tab: string) => setActiveTab(tab);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      {/* Tab Navigation */}
      <View className="flex-row justify-around border-b border-[#1A1B1E]">
        <TouchableOpacity
          onPress={() => handleTabPress("Balances")}
          className={`border-b-2 ${
            activeTab === "Balances"
              ? "border-orange-500 py-[10px] px-[24px]"
              : "border-transparent py-[10px] px-[24px]"
          }`}
        >
          <Text
            className={`text-[16px] font-PlusJakartaSansMedium ${
              activeTab === "Balances" ? "text-white" : "text-gray-400"
            }`}
          >
            Balances
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress("Collectibles")}
          className={`border-b-2 ${
            activeTab === "Collectibles"
              ? "border-orange-500 py-[10px] px-[24px]"
              : "border-transparent py-[10px] px-[24px]"
          }`}
        >
          <Text
            className={`text-[16px] font-PlusJakartaSansMedium ${
              activeTab === "Collectibles" ? "text-white" : "text-gray-400"
            }`}
          >
            Collectibles
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={true}
      >
        {activeTab === "Balances" ? (
          <>
            <WalletBalance
              balances={walletData?.balances}
              addresses={walletData?.addresses}
              isLoading={loading}
              usdcPrice={walletBalanceData?.data?.usdcPrice}
              onCopyAddress={async (address) => {
                await Clipboard.setStringAsync(address);
                Alert.alert("Address Copied");
              }}
            />
            {/* Fund with Card Button */}
            <TouchableOpacity
              onPress={() => router.push("/wallet/fund")}
              className="bg-[#202227] mx-4 my-3 px-[16px] pt-[20px] pb-[19px] rounded-[10px] flex-row justify-between items-center"
            >
              <View className="flex-1 flex-row items-center gap-[16px]">
                <CreditCardIcon size={24} color="#FF8A49" variant="stroke" />
                <View>
                  <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium">
                    Fund with Wallet
                  </Text>
                  <Text className="text-[14px] text-[#63656B] font-PlusJakartaSansMedium">
                    Fund with wallet with several options
                  </Text>
                </View>
              </View>
              <ArrowRight01Icon size={24} color="#FF8A49" />
            </TouchableOpacity>
            {/* Transaction History */}
            <View className="flex-1 mt-[48px] px-[16px]">
              <View className="flex-row items-center justify-between px-4 py-[12px]">
                <Text className="text-[#D2D3D5] text-[20px] font-PlusJakartaSansMedium">
                  History
                </Text>
                <FilterButton
                  options={filterOptions}
                  selectedOption={selectedPeriod}
                  onOptionSelect={setSelectedPeriod}
                />
              </View>
              <TransactionHistory
                transactions={walletData.transactions}
                isLoading={transactionsLoading}
              />
            </View>
          </>
        ) : (
          <>
            <View className="mx-4 my-4">
              <View className="bg-[#111318] py-[15px] rounded-[10px] px-4 flex-row items-center gap-x-[12px] border border-[#202227]">
                <Search01Icon size={16} color="#63656B" variant="stroke" />
                <TextInput
                  placeholder="Search collectibles"
                  placeholderTextColor="#63656B"
                  className="flex-1 text-[14px] text-white font-PlusJakartaSansMedium"
                />
              </View>
            </View>
            <FlatList
              data={[
                {
                  id: "1",
                  title: "Rave Pass",
                  price: "$5/month",
                  image: require("../../../assets/images/reave-pass.png"),
                },
                {
                  id: "1",
                  title: "Rave Pass",
                  price: "$5/month",
                  image: require("../../../assets/images/reave-pass.png"),
                },
              ]}
              numColumns={2}
              contentContainerStyle={{
                padding: 16,
                alignItems: "center",
                gap: 16,
              }}
              columnWrapperStyle={{
                gap: 16,
                justifyContent: "center",
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ width: wp("45%") }}
                  className="h-[262px] bg-[#111318] rounded-[10px] border-2 border-[#202227] overflow-hidden"
                  onPress={() => router.navigate("/wallet/collectibleDetail")}
                >
                  <Image
                    source={item.image}
                    className="w-full h-[140px]"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-3">
                    <View className="flex-1">
                      <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium text-[16px] leading-[22px]">
                        {item.title}
                      </Text>
                      <Text className="text-[#63656B] font-PlusJakartaSansMedium text-[12px] leading-[16px] mt-1">
                        {item.title}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between w-full mt-3">
                      <View className="bg-[#202227] border-[0.5px] border-[#63656B] rounded-full px-3 py-1">
                        <Text className="text-[#f4f4f4] text-[12px] font-PlusJakartaSansMedium">
                          Tribes
                        </Text>
                      </View>
                      <Image
                        source={require("../../../assets/images/logo-gray.png")}
                        className="w-[40px] h-[18px]"
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </ScrollView>

      <PayWithCard
        isVisible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;
