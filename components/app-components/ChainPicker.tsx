import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FilterButton from './FilterButton'
import { useWalletBalance } from '@/hooks/useWalletBalance'

const ChainPicker = ({ userId }: { userId: string }) => {
    const [selectedNetwork, setSelectedNetwork] = useState('Xion');
    const networkOptions = ['Xion', 'Starknet'];
    const { data: walletData, isLoading } = useWalletBalance(userId);

    const networkIcon = (
        <Image
          source={selectedNetwork === 'Xion'
            ? require("../../assets/images/xion.png")
            : require("../../assets/images/starknet.png")
          }
          className="w-5 h-5"
        />
    );

    const getFormattedBalance = (amount: number) => {
        return amount.toFixed(3);
    };

    const xionBalance = walletData?.data.xion.balances[0]?.amountFloat || 0;
    const starknetBalance = walletData?.data.starknet.balance.balanceFloat || 0;
    const totalBalance = xionBalance + starknetBalance;

    const renderBalance = (balance: number) => {
        if (isLoading) {
            return <ActivityIndicator size="small" color="#A5A6AA" />;
        }
        return `${getFormattedBalance(balance)} USDC`;
    };

    return (
        <View className="bg-[#0A0B0F] border border-[#1B1E26] px-[8px] py-[11px] rounded-[16px]">
            <View className="flex-row items-center bg-[#12141B] justify-between rounded-[14px] pl-[21px] pr-[12px] py-[11px]">
                <View className="flex-row items-center gap-x-[8px]">
                <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
                  5
                 </Text>
                    <Image source={require("../../assets/images/usdc-icon.png")} className="w-5 h-5" />
                    <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">USDC</Text>
                </View>
                <FilterButton
                    options={networkOptions}
                    selectedOption={selectedNetwork}
                    onOptionSelect={setSelectedNetwork}
                    icon={networkIcon}
                />
            </View>
            <View className="flex-row items-center px-[16px] gap-x-[16px] py-[8px] border-t-[0.5px] border-[#2A2C32]">
                <View className="flex-row items-center">
                    <Image source={require("../../assets/images/xion.png")} className="w-4 h-4 mr-[4px]" />
                    <Text className="text-[14px] text-[#A5A6AA]">
                        {renderBalance(xionBalance)}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Image source={require("../../assets/images/starknet.png")} className="w-4 h-4 mr-[4px]" />
                    <Text className="text-[14px] text-[#A5A6AA]">
                        {renderBalance(starknetBalance)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ChainPicker
