import { View, Text, ScrollView } from 'react-native'
import { ArrowRight01Icon } from '@hugeicons/react-native'
import React, { useLayoutEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const Notification = () => {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Notification' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    const notificationSections = [
        {
            title: "Music & Discoverability",
            items: [
                {
                    title: "New Release Alert",
                    subtitle: "Push, In-app Email",
                    route: "/settings/(notification)/(music)/new-release"
                },
                {
                    title: "Playlist Updates",
                    subtitle: "Push, Email",
                    route: "/settings/(notification)/(music)/playlist"
                },
                {
                    title: "Song Recommendation",
                    subtitle: "In-app Email",
                    route: "/settings/(notification)/(music)/song"
                },
                {
                    title: "Artiste Recommention",
                    subtitle: "Off",
                    route: "/settings/(notification)/(music)/artist"
                }
            ]
        },
        {
            title: "Security & Account Alerts",
            items: [
                {
                    title: "Login from New Device",
                    subtitle: "Push, In-app Email",
                    route: "/settings/(notification)/(security)/login"
                },
                {
                    title: "Payment Method Update",
                    subtitle: "Push, Email",
                    route: "/settings/(notification)/(billing)/payment"
                }
            ]
        },
        {
            title: "Subscription & Payments",
            items: [
                {
                    title: "Subscription Renewal Reminder",
                    subtitle: "Push, In-app Email",
                    route: "/settings/(notification)/(billing)/renewal"
                },
                {
                    title: "Subscription Canceled",
                    subtitle: "Push, Email",
                    route: "/settings/(notification)/(billing)/cancel"
                },
                {
                    title: "NFT Minting Confirmation",
                    subtitle: "Push, Email",
                    route: "/settings/(notification)/(nft)/minting"
                },
                {
                    title: "Transaction Confirmation",
                    subtitle: "Push, Email",
                    route: "/settings/(notification)/(nft)/transaction"
                }
            ]
        },
        {
            title: "Post Updates",
            items: [
                {
                    title: "Post Updates",
                    subtitle: "Push, In-app Email",
                    route: "/settings/(notification)/(social)/posts"
                }
            ]
        }
    ]

    return (
        <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
        >
            <View className='px-[24px] pt-[20px] pb-[32px]'>
                <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                    Decide how and when you receive alerts. Customize email, push, and in-app notifications to stay updated.
                </Text>

                <View className='gap-y-[32px]'>
                    {notificationSections.map((section, index) => (
                        <View key={index} className='gap-y-[16px]'>
                            <Text className='text-[16px] font-PlusJakartaSansSemiBold text-[#f4f4f4]'>
                                {section.title}
                            </Text>
                            <View className='gap-y-[4px]'>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        onPress={() => router.push(item.route)}
                                        className='flex-row items-center justify-between py-[16px]'
                                    >
                                        <View className='flex-1'>
                                            <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                                                {item.title}
                                            </Text>
                                            <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                                                {item.subtitle}
                                            </Text>
                                        </View>
                                        <ArrowRight01Icon size={24} color='#787A80' variant='stroke' />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Notification
