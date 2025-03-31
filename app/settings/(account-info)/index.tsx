import { View, Text, Modal } from 'react-native'
import { AccessIcon, ArrowRight01Icon, Notification02Icon, Settings01Icon, Shield02Icon, UserCircleIcon, Search01Icon, LockPasswordIcon, Delete01Icon } from '@hugeicons/react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import { useClerkAuthentication } from '@/hooks/useClerkAuthentication'
import { useAppSelector } from '@/redux/hooks'
import { account } from '@/appWrite'
import { showToast } from '@/components/ShowMessage'

const accountInfo = () => {
    const navigation = useNavigation()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { handleDeleteAccount, loading } = useClerkAuthentication();


    useLayoutEffect(() => {
      navigation.setOptions((
        {
          headerLeft: () =><AppBackButton name='Personal Details' onBackPress={() => router.back()} />,
          headerRight: () => null
        }
      ))
    })

    const settingsMenuItems = [
        {
            title: "Personal Details",
            description: "Update your account details to ensure everything stays current.",
            icon: <UserCircleIcon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(account-info)/personalInfo"
        },
        {
            title: "Change your password",
            description: "Ensure your account stays protected by resetting your password.",
            icon: <LockPasswordIcon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(account-info)/change-password"
        },
    ]

    const handleDeletePress = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setShowDeleteModal(false);
            router.replace('/');
        } catch (error) {
            console.error('Error during account deletion:', error);
            showToast('Failed to delete account. Please try again.', 'error');
        }
    };

  return (
    <View className='px-[24px] gap-y-[36px] pt-[20px]'>
        <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>Update your account details, change your password, or deactivate your account.</Text>
     <View className='gap-y-[12px]'>
                {
                    settingsMenuItems.map((menu, key) => (
                        <TouchableOpacity onPress={() =>  router.push(menu.route)} key={key} className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px] gap-x-[16px] '>
                            <View className='w-[24px]'>
                                {menu.icon}
                            </View>
                            <View className='flex-1'>
                                <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>{menu.title}</Text>
                                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>{menu.description}</Text>
                            </View>
                            <View className='w-[24px]'>
                                <ArrowRight01Icon size={24} color='#787A80' variant='stroke' />
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <TouchableOpacity
                onPress={handleDeletePress}
                className='bg-[#1D0607] gap-x-[8px] flex-row items-center justify-center mx-auto py-[20px] px-[32px] rounded-[10px]'
            >
                <Delete01Icon size={24} color='#FF5454' variant='solid' />
                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#FF5454]'>
                    Deactivate your account
                </Text>
            </TouchableOpacity>

            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 bg-black/80 justify-center items-center px-[24px]">
                    <View className="bg-[#12141B] p-[24px] rounded-[16px] w-full">
                        <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4] mb-[16px]">
                            Are you sure?
                        </Text>

                        <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80] mb-[24px]">
                            Before you delete your account, please note that:
                        </Text>

                        <View className="gap-y-[12px] mb-[24px]">
                            <Text className="text-[14px] text-[#D2D3D5]">• All your data will be permanently deleted</Text>
                            <Text className="text-[14px] text-[#D2D3D5]">• You'll lose access to your music and playlists</Text>
                            <Text className="text-[14px] text-[#D2D3D5]">• This action cannot be undone</Text>
                        </View>

                        <View className="flex-row gap-x-[12px]">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                className="flex-1 py-[16px] bg-[#1D2029] rounded-[10px]"
                            >
                                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#f4f4f4] text-center">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={confirmDelete}
                                disabled={loading}
                                className="flex-1 py-[16px] bg-[#2A1215] rounded-[10px]"
                            >
                                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#FF5454] text-center">
                                    {loading ? 'Deleting...' : 'Delete Account'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default accountInfo
