import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image,  TouchableOpacity } from 'react-native';
import Modal from 'react-native-modalbox';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  page: string
};

const SigninModal = ({ open, setOpen, page }: Props) => {
    const router = useRouter()
  return (
    <Modal
      isOpen={open}
      onClosed={() => setOpen(false)}
      style={{
        width: wp('98%'),
        maxHeight: hp('60%'),
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 8
      }}
      position="center"
      backdropColor="#040405"
      backdropOpacity={0.8}
      swipeToClose={true}
    >
    <Image
    source={require("../../../assets/images/SigninModal.png")}
    style={{width: wp("94%")}}
    className='rounded-t-[20px]' />
    <View className='items-start justify-center pt-[30px] px-[32px]'>
        <Text className='text-Grey/06 font-PlusJakartaSans-Light'>Powered by Argent</Text>
        <Text
        className='font-extrabold text-[24px] items-stretch font-PlusJakartaSans-ExtraBold'
        >
          {page === "createAccount" && "Signing in on Looop"}
          {page === "signin" && "Welcome back to Looop"}
            </Text>
            <Text className='text-[14px] font-PlusJakartaSans-Light pt-[8px]'>
                {page === "createAccount" && "Looop uses Argent to create and manage user accounts. On clicking continue you will be directed to create an account on Argent. Not to worry, you’ll be right back soon."}
                {page === "signin" && "On clicking continue you will be directed to log in to your account on Argent. Not to worry, you’ll be right back soon."}
                </Text>
    <TouchableOpacity onPress={() => router.push("./WelcomeOnboard")}  className='bg-Orange/08 items-center mt-[59px] w-full py-[20px] border rounded-[24px] border-Orange/08'>
        <Text className='text-[#fff] font-14px] font-PlusJakartaSansBold font-normal'>{page === "createAccount" ? "Continue to Create Account": "Sign in on Argent"}</Text>
    </TouchableOpacity>
    </View>


    </Modal>
  );
};

export default SigninModal;
