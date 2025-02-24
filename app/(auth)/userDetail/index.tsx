import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import AuthHeader from '@/components/AuthHeader';
import { AppButton } from '@/components/app-components/button';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from './DatePicker';
import { FormField } from '@/components/app-components/formField';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useLocalSearchParams, useRouter } from 'expo-router';



type FormData = {
  dob: string;
  gender: string;
};

const schema = z.object({
  dob: z.string({
    message: "Date of birth is required",
  }).nonempty({ message: "Date of birth is required" }),
  gender: z.string({
    message: "gender is required",
  }).nonempty({ message: "Gender is required" }),
});

const UserDetail = () => {
  const {email, password} = useLocalSearchParams<{ email: string, password: string }>();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.navigate({ pathname: "/(auth)/enterUserName", params: { email, password, ...data } });
  };

  return (
    <View className="flex-1 px-6 gap-12"

    >
      <AuthHeader 
        title="Tell Us About Yourself" 
        description='Just a few more details to personalize your experience!' 
      />

      

      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          Enter date of birth
        </Text>
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePicker
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.dob && (
          <Text className="text-red-500">{errors.dob.message}</Text>
        )}
      </View>

      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          Gender
        </Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField.PickerField
              value={value}
              onSelect={onChange}
              options={
                [
                  {
                    label:"male",
                    value:"male"
                  },
                  {
                    label: "female",
                    value: "female"
                  }
                ]}
                showSearch={false}
                
              placeholder="Select gender"
            />
          )}
        />
        {errors.gender && (
          <Text className="text-red-500">{errors.gender.message}</Text>
        )}
      </View>
      
      <View style= {styles.buttomButtonContainer}>
        
      <AppButton.Secondary 
        onPress={handleSubmit(onSubmit)} 
        text="Continue"
        color='#FF7A1B'
        
      />
      </View>

    </View>
  );
};

export default UserDetail;
const styles = StyleSheet.create({
  buttomButtonContainer:{
    position: 'absolute',
    bottom: hp('5%'),
    left: 0,
    right: 0,
    padding: 20,
  
  }
})