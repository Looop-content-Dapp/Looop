import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';

interface CurrencySelectorProps {
  availableCurrencies: Array<{
    value: string;
    icon: string;
    label?: string;
  }>;
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  availableCurrencies,
  selectedCurrency,
  onCurrencySelect
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find the selected currency object
  const selectedCurrencyObj = availableCurrencies.find(c => c.value === selectedCurrency);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(true)}
        className="flex-row items-center bg-[#12141B] px-3 py-2 rounded-lg"
      >
        {selectedCurrencyObj && (
          <Image
            source={{ uri: selectedCurrencyObj.icon }}
            className="w-5 h-5 rounded-full mr-2"
          />
        )}
        <Text className="text-white text-[14px] font-PlusJakartaSansMedium mr-1">
          {selectedCurrency}
        </Text>
        <Text className="text-[#787A80]">▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className="bg-[#0A0B0F] rounded-xl p-4 w-[80%] max-w-[300px]">
            <Text className="text-white text-lg font-PlusJakartaSansBold mb-4">
              Select Currency
            </Text>

            {availableCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.value}
                onPress={() => {
                  onCurrencySelect(currency.value);
                  setIsDropdownOpen(false);
                }}
                className={`flex-row items-center p-3 rounded-lg mb-2 ${
                  selectedCurrency === currency.value ? "bg-[#12141B]" : "bg-transparent"
                }`}
              >
                <Image
                  source={{ uri: currency.icon }}
                  className="w-6 h-6 rounded-full mr-3"
                />
                <Text className={`text-[16px] font-PlusJakartaSansMedium ${
                  selectedCurrency === currency.value ? "text-white" : "text-[#787A80]"
                }`}>
                  {currency.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CurrencySelector;
