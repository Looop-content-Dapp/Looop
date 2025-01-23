import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Add01Icon,
    Copy02Icon,
    Delete01Icon,
    InformationCircleIcon,
} from '@hugeicons/react-native';
import { router } from 'expo-router';
import { banks } from '@/data/data';
import { FormField } from '@/components/app-components/formField copy';

type ScreenType = 'main' | 'addAccount' | 'accountDetails';

interface Bank {
    label: string;
    value: string;
    logo: string;
    branches: string[];
}

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankLogo: string;
}

const ConnectedAccountsScreen = () => {
    const [activeScreen, setActiveScreen] = useState<ScreenType>('main');
    const [selectedBank, setSelectedBank] = useState<Bank>();
    const [accounts, setAccounts] = useState<BankAccount[]>([
        {
            id: '1',
            bankName: 'First Bank of Nigeria PLC',
            accountNumber: '3273840488',
            accountName: 'Antony Joshua',
            bankLogo: '🏦'
        },
        {
            id: '2',
            bankName: 'Access Bank',
            accountNumber: '3273840488',
            accountName: 'Antony Joshua',
            bankLogo: '🏦'
        }
    ]);
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [newAccount, setNewAccount] = useState({
        accountNumber: '',
        bankName: '',
        accountName: ''
    });

    const handleBackNavigation = () => {
        if (activeScreen !== 'main') {
            setActiveScreen('main');
        } else {
            router.back();
        }
    };

    const handleAccountPress = (account: BankAccount) => {
        setSelectedAccount(account);
        setActiveScreen('accountDetails');
    };

    const handleAddAccount = () => {
        setActiveScreen('addAccount');
    };

    const handleRemoveAccount = (accountId: string) => {
        setAccounts(accounts.filter(acc => acc.id !== accountId));
        setActiveScreen('main');
    };

    const handleAddNewAccount = () => {
        if (newAccount.accountNumber && newAccount.bankName && newAccount.accountName) {
            const newBankAccount: BankAccount = {
                id: Date.now().toString(),
                bankName: newAccount.bankName,
                accountNumber: newAccount.accountNumber,
                accountName: newAccount.accountName,
                bankLogo: '🏦'
            };
            setAccounts([...accounts, newBankAccount]);
            setNewAccount({ accountNumber: '', bankName: '', accountName: '' });
            setActiveScreen('main');
        }
    };

    const renderMainContent = () => (
        <View className="px-4 pt-[72px]">
            <Text className="text-white text-xl font-bold mb-6">Linked Accounts</Text>
            {accounts.map((account) => (
                <TouchableOpacity
                    key={account.id}
                    className="bg-[#12141B] p-4 rounded-lg mb-4"
                    onPress={() => handleAccountPress(account)}
                >
                    <View className="flex-row items-center">
                        <Text className="text-2xl mr-3">{account.bankLogo}</Text>
                        <View>
                            <Text className="text-white text-base">{account.accountNumber}</Text>
                            <Text className="text-[#787A80] text-sm">{account.accountName}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                className="mt-4 flex-row items-center gap-x-[8px] max-w-[164px] mx-auto justify-center bg-[#12141B] p-4 rounded-lg"
                onPress={handleAddAccount}
            >
                <Add01Icon color='#A5A6AA' size={16} variant='solid' />
                <Text className="text-[#A5A6AA] text-center">Add bank account</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAddAccount = () => (
        <View className="px-4">
            <Text className="text-white text-xl font-bold mb-4">Add Your Account</Text>
            <View className='flex-row items-start gap-x-[8px] p-[12px] bg-[#2A1708] my-[24px] rounded-[10px]'>
                <InformationCircleIcon size={16} color='#EC6519' variant='stroke' />
                <Text className="text-[#EC6519] mb-6 font-PlusJakartaSansRegular text-[14px]">
                    Make sure to confirm that the bank account details are yours and are correct.
                </Text>
            </View>

            <FormField.TextField
                label="Account Number"
                placeholder="Enter account number"
                value={newAccount.accountNumber}
                onChangeText={(text: string) => setNewAccount({ ...newAccount, accountNumber: text })}
                keyboardType="numeric"
            />

            <FormField.PickerField
                label="Select Bank"
                placeholder="Choose your bank"
                value={selectedBank?.label || ''}
                onSelect={(value: any) => {
                    const bank = banks.find(b => b.label === value);
                    setSelectedBank(bank);
                }}
                options={banks}
            />

            <FormField.TextField
                label="Account Name"
                placeholder="Enter account name"
                value={newAccount.accountName}
                onChangeText={(text: string) => setNewAccount({ ...newAccount, accountName: text })}
            />

            <TouchableOpacity
                className={`bg-[#FF8A49] p-4 rounded-lg mt-6 ${
                    !(newAccount.accountNumber && newAccount.bankName && newAccount.accountName)
                        ? 'opacity-50'
                        : ''
                }`}
                onPress={handleAddNewAccount}
                disabled={!(newAccount.accountNumber && newAccount.bankName && newAccount.accountName)}
            >
                <Text className="text-white text-center font-bold">Continue</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAccountDetails = () => {
        if (!selectedAccount) return null;

        return (
            <View className="px-4">
                <Text className="text-white text-xl font-bold mb-6">Bank Account</Text>

                <View className="bg-[#12141B] p-4 rounded-lg mb-4">
                    <View className="flex-row items-center mb-4">
                        <Text className="text-2xl mr-3">{selectedAccount.bankLogo}</Text>
                        <View>
                            <Text className="text-white text-base">{selectedAccount.accountName}</Text>
                            <Text className="text-[#787A80] text-sm">{selectedAccount.bankName}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between bg-[#1D2029] p-3 rounded-lg">
                        <Text className="text-white">{selectedAccount.accountNumber}</Text>
                        <TouchableOpacity>
                            <Copy02Icon size={20} color="#787A80" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="mt-4 flex-row items-center justify-center bg-[#2A1215] p-4 rounded-lg"
                    onPress={() => handleRemoveAccount(selectedAccount.id)}
                >
                    <Delete01Icon size={20} color="#FF3B30" className="mr-2" />
                    <Text className="text-[#FF3B30]">Remove bank account</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderContent = () => {
        switch (activeScreen) {
            case 'addAccount':
                return renderAddAccount();
            case 'accountDetails':
                return renderAccountDetails();
            case 'main':
            default:
                return renderMainContent();
        }
    };

    const getHeaderTitle = () => {
        switch (activeScreen) {
            case 'addAccount':
                return 'Add Your Account';
            case 'accountDetails':
                return 'Bank Account';
            case 'main':
            default:
                return 'Connected Accounts';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Header */}
            <View className="px-4 py-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={handleBackNavigation}>
                        <Text className="text-[#787A80] text-base">
                            {activeScreen !== 'main' ? 'Back' : 'Close'}
                        </Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">{getHeaderTitle()}</Text>
                    <View className="w-16" />
                </View>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ConnectedAccountsScreen;
