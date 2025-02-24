import { View, Text, TextInput, Alert,  StyleSheet } from 'react-native';
import React from 'react';
import AuthHeader from '@/components/AuthHeader';
import { AppButton } from '@/components/app-components/button';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useCreateUser } from '@/hooks/useCreateUser';
import { calculateAge } from '@/utils/calculateAge';


type FormData = {
    username: string;
    name: string;
};
const schema = z.object({
    username: z.string({
        message: "Username is required",
    }).nonempty({ message: "Username is required" }),
    name: z.string({
        message: "Name is required",
    }).nonempty({ message: "Name is required" }),
});
const EnterUserName = () => {
    const {
        mutate:createUser,
        isPending,
    } = useCreateUser();
    const {
        email,
        password,
        dob,
        gender,
    } = useLocalSearchParams<{ email: string, password: string
    dob: string; gender: string }>();
    const router = useRouter();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log({
            email,
            password,
            age: calculateAge(dob).toLocaleString(),
            fullname: data.name,
            username: data.username
        });

        createUser({
            email,
            password,
            age: calculateAge(dob).toLocaleString(),
            fullname: data.name,
            username: data.username,
            gender,
        }, {
            onSuccess: () => {
                router.navigate({ pathname: "/(settingUp)", params: { email, password, ...data } });
            },
            onError: (error) => {
                Alert.alert("Error", "Failed to create account. Please try again.");
            },
        });

    };
  return (
    <View className='flex-1 px-6 gap-12'>

        <AuthHeader
            title="Tell Us About Yourself"
            description='Just a few more details to personalize your experience!'
        />
    
        <View className="gap-y-3">
            <View className="gap-y-1">  
            <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
            What&rsquo;s your name?
            </Text>
            <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
                This is the name that will be displayed on your profile
            </Text>
            </View>
            
            <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Name"
                className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                />
            )}
            />
            {errors.name && (
            <Text className="text-red-500 text-[12px]">{errors.name.message}</Text>
            )}

            </View>
            <View className="gap-y-3">
            <View className="gap-y-1">
            <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
            Pick your username
            </Text>
            <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
            We&rsquo;ll use this to create your meta account 
            </Text>
            </View>
            <Controller

            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Username"
                className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                />
            )}
            />
            {errors.username && (
            <Text className="text-red-500 text-[12px]">{errors.username.message}</Text>
            )}

            </View>
            <View className="gap-y-4">
                    <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
                        By tapping create account, you agree to our <Link
                        className='text-[#FF7A1B] text-[12px] font-PlusJakartaSansRegular'
                         href="/terms">Terms of Service</Link> and <Link 
                            className='text-[#FF7A1B] text-[12px] font-PlusJakartaSansRegular'
                        href="/privacy">Privacy Policy</Link>
                    </Text>
                </View>
            <View style={styles.buttomButtonContainer}>
                
            <AppButton.Secondary
            text="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            
            color='#FF7A1B'
            />
            </View>


    




      
    </View>
  )
}


const styles = StyleSheet.create({
    buttomButtonContainer:{
      position: 'absolute',
      bottom: hp('5%'),
      left: 0,
      right: 0,
      padding: 20,
    
    }
  })
export default EnterUserName