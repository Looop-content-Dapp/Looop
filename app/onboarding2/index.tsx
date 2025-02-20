import { View, Text, StatusBar, StyleSheet, Image, type ImageSourcePropType, ImageBackground } from 'react-native'
import React from 'react'
import { newonboard1, newonboard2, newonboard3, newonboard4, newonboard5, vector1, logowhite } from '@/assets/images/images'
import { SafeAreaView } from 'react-native-safe-area-context'
import Onboarding from "react-native-onboarding-swiper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
const Onboard2 = () => {
    return (
        <>
            <StatusBar
                backgroundColor={"transparent"}
                translucent={true}
                barStyle="light-content"
            />
            <SafeAreaView
                style={[styles.container, { backgroundColor: "#FF6D1B" }]}>
                <Onboarding
                    pages={[
                        {
                            backgroundColor: '#FF6D1B',
                            image: (
                                <View className='flex-1 items-center justify-center flex-col'>
                                    <Image
                                        source={logowhite}

                                        resizeMode="cover"

                                    />
                                    <ImageBackground
                                        source={vector1 as ImageSourcePropType}

                                        resizeMode="contain"
                                        style={{
                                            width: wp("100%"),
                                            height: hp("100%"),

                                        }}

                                    >
                                    </ImageBackground>
                                    <Image source={newonboard1}
                                        style={{
                                            width: wp("100%"),
                                            height: hp("100%"),
                                            resizeMode: "contain",
                                        }}
                                    />
                                </View>
                            ),
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#FF6D1B',
                            image: <Image source={newonboard2} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#FF6D1B',
                            image: <Image source={newonboard3} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#FF6D1B',
                            image: <Image source={newonboard4} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                        {
                            backgroundColor: '#FF6D1B',
                            image: <Image source={newonboard5} />,
                            title: 'Onboarding',
                            subtitle: 'Done with React Native Onboarding Swiper',
                        },
                    ]}
                />


            </SafeAreaView>
        </>
    )
}

export default Onboard2

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});