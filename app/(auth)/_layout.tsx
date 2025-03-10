import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { account } from '../../appWrite';
import { useUserAuth } from '../../context/AuthContextProvider';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AuthFooter from '@/components/AuthFooter';

export default function AuthLayout() {
  const router = useRouter();
  const { firstTimeUser } = useUserAuth();

  // useEffect(() => {
  //   const checkUserAuth = async () => {
  //     try {
  //       // Try to get current session
  //       const user = await account.get();

  //       if (!user) {
  //         // No authenticated user, go to auth screen
  //         router.replace('/(auth)');
  //         return;
  //       }

  //       if (firstTimeUser) {
  //         // User is authenticated but it's their first time
  //         router.replace('/(settingUp)');
  //         return;
  //       }

  //       // User is authenticated and not first time
  //       router.replace('/(musicTabs)');

  //     } catch (error) {
  //       // If there's an error or no session, redirect to auth
  //       console.error('Auth check failed:', error);
  //       router.replace('/(auth)');
  //     }
  //   };

  //   checkUserAuth();
  // }, [firstTimeUser]); // Re-run when firstTimeUser changes

  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#040405",
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#040405"
            }
          }}
        />





        {/* <AuthFooter /> */}

      </SafeAreaView>
    </>
  );
}
