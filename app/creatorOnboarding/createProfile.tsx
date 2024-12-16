import { View, Text, Image, TouchableOpacity, ScrollViewBase, ScrollView } from 'react-native';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { AppButton } from '@/components/app-components/button';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { AppBackButton } from '@/components/app-components/back-btn';
import CreatorForm from '@/components/CreatorOnboarding/creatorProfileFlow/CreatorForm';

const CreateProfile = () => {
   const [currentFlow, setCurrentFlow] = useState("Intro");
   const navigation = useNavigation()
   const { back, navigate } = useRouter();

   const headerOptions = useMemo(() => ({
       headerShown: currentFlow === "create Profile",
       headerLeft: () => <AppBackButton name='Set up creator profile' onBackPress={back} />,
       headerRight: () => (<></>),
   }), [currentFlow]);

   useLayoutEffect(() => {
       navigation.setOptions(headerOptions);
   }, [navigation, headerOptions]);

   const renderIntro = () => (
       <View>
           <Image
               source={require("../../assets/images/createProfile.png")}
               resizeMode='cover'
               style={{ width: '90%', alignSelf: 'center', marginTop: '20%' }}
           />
           <View style={{ marginTop: '30%', alignSelf: 'center', gap: 12 }}>
               <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' }}>Create your profile</Text>
               <Text style={{ fontSize: 16, color: '#D2D3D5' }}>
                   Ready to create magic? Let’s get you started by setting up your creator profile
               </Text>
           </View>
       </View>
   );

   const handleFlow = () => {
       switch (currentFlow) {
           case "Intro":
               return renderIntro();
           case "create Profile":
               return <CreatorForm />;
           default:
               return null; // No re-setting state unnecessarily
       }
   };

   const handleNext = () => {
       switch (currentFlow) {
           case "Intro":
               setCurrentFlow("create Profile");
               case "create Profile":
                //  navigate("/creatorOnboarding/ContractSigning")
           default:
               break;
       }
   };

   return (
       <SafeAreaView style={{ flex: 1 }}>
         {handleFlow()}
        <View style={{ position: 'absolute', bottom: 60, right: 24, left: 24 }}>
               <AppButton.Primary text='Continue' color='#A187B5' loading={false} onPress={handleNext} />
           </View>
       </SafeAreaView>
   );
};

export default CreateProfile;
