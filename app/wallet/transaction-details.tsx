import React, { useLayoutEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import TransactionDetails from '@/components/wallet/TransactionDetails';
import { AppBackButton } from '@/components/app-components/back-btn';

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name='' onBackPress={() => router.back()} />
    });
  }, [navigation]);

  return <TransactionDetails transactionId={id as string} />;
}
