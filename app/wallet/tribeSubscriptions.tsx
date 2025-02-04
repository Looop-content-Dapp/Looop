import { View, Text, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import FilterButton from '@/components/app-components/FilterButton'
import { InformationCircleIcon } from '@hugeicons/react-native'


const tribeSubscriptions = () => {
    const navigation = useNavigation()
    const filterTimeFrame: string[] = ["Last 30 days", "2 months", "1 year"];
    const [timeFrame, setTimeFrame] = useState('Last 30 days');
    
    // Sample data - replace with actual data
    const earnings = 32578.48;
    const percentageChange = 43.85;
    const nextPayoutDate = "January 15, 2025";
    const payoutHistory = [
      { amount: 5, date: "January 2025", time: "04:00 PM", txId: "#47388" },
      { amount:5, date: "January 2025", time: "08:50 PM", txId: "#32374" },
      { amount: 5, date: "January 2025", time: "06:00 PM", txId: "#28392" },
      { amount: 5, date: "December 2024", time: "04:00 PM", txId: "#47374" },
    ];

    // Group payouts by month and year
    const groupedPayouts = payoutHistory.reduce((groups, payout) => {
      const monthYear = payout.date; // Already in "Month Year" format
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(payout);
      return groups;
    }, {});

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Tribe Subscriptions' onBackPress={() => router.back()} />,
        })
      }, [])

    return (
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32
        }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Next Payout Notice */}
        <View className="mt-4 bg-[#2A1708] gap-x-[12px] rounded-[10px] p-[12px] flex-row items-center">
            <InformationCircleIcon size={16} color='#EC6519' variant='stroke' />
          <Text className="text-[#EC6519] text-[14px] font-PlusJakartaSansRegular">
            Next payout date: {nextPayoutDate}
          </Text>
        </View>

        {/* Earnings Section */}
        <View className="mt-4 bg-[#0A0B0F] border-[1px] border-[#12141B] rounded-lg p-4">
          <View className="flex-row justify-between items-start">
       <View className='gap-y-[8px]'>
          <Text className="text-[#787A80] font-PlusJakartaSansBold text-[16px]">Earnings</Text>
         

     <Text className="text-[#f4f4f4] text-[28px] font-PlusJakartaSansBold">
             ${earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
           </Text>
           <Text className="text-[#A2FA96] text-[14px] font-PlusJakartaSansRegular mt-1">
             +{percentageChange}% <Text className='text-[#F4F4F4]'>from last 30d</Text>
           </Text>
       </View>

          <FilterButton
              options={filterTimeFrame}
              selectedOption={timeFrame}
              onOptionSelect={setTimeFrame}
            />
          </View>
          
         
        </View>

        <View className='flex-row items-center justify-around gap-x-[8px]'>

        <View className="mt-4 bg-[#0A0B0F] border-[1px] border-[#12141B] rounded-lg p-4 w-[50%]">
        <Text className="text-[#787A80] font-PlusJakartaSansBold text-[14px]">New subscribers</Text>
         <Text className="text-[#f4f4f4] text-[28px] font-PlusJakartaSansBold">
            578
        </Text>
        </View>

        <View className="mt-4 bg-[#0A0B0F] border-[1px] border-[#12141B] rounded-lg p-4 w-[50%]">
        <Text className="text-[#787A80] font-PlusJakartaSansBold text-[14px]">Renewed subscriptions</Text>
         <Text className="text-[#f4f4f4] text-[28px] font-PlusJakartaSansBold">
            3,578
        </Text>
        </View>
        </View>

        {/* Payout History */}
        <View className="mt-[48px] gap-y-[40px]">
          <Text className="text-[#f4f4f4] text-[20px] font-PlusJakartaSansMedium font-semibold mb-[24px]">
            Payouts History
          </Text>
          
          {Object.entries(groupedPayouts).map(([monthYear, payouts]) => (
            <View key={monthYear} className="mb-[24px]">
              <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium mb-3">
                {monthYear}
              </Text>
              
              {payouts.map((payout, index) => (
                <View 
                  key={payout.txId} 
                  className={`bg-[#12141B] rounded-lg p-4 flex-row justify-between items-center ${
                    index !== 0 ? 'mt-2' : ''
                  }`}
                >
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-white font-PlusJakartaSansBold text-[16px]">
                        You received 
                      </Text>
                      <Text className="text-[#73F762] font-PlusJakartaSansBold text-[16px] ml-1">
                        ${payout.amount}
                      </Text>
                    </View>
                    <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[12px] mt-1">
                      txID: {payout.txId}
                    </Text>
                  </View>
                  
                  <View className="items-end">
                    <Text className="text-gray-400 text-sm">
                      {payout.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    )
}

export default tribeSubscriptions