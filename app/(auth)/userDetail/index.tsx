import { View, Text, TextInput } from 'react-native';
import React from 'react';
import AuthHeader from '@/components/AuthHeader';
import { AppButton } from '@/components/app-components/button';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from './DatePicker';

type FormData = {
  username: string;
  dob: string;
  name: string;
  gender: string;
};

const schema = z.object({
  username: z.string().nonempty({ message: "Username is required" }),
  dob: z.string().nonempty({ message: "Date of birth is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  gender: z.string().nonempty({ message: "Gender is required" }),
});

const UserDetail = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <View className="flex-1 px-6 gap-12">
      <AuthHeader 
        title="Complete your profile" 
        description='Just a few more details to personalize your experience!' 
      />

      
      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          What's your name?
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="..."
              placeholderTextColor={'#D2D3D5'}
              style={{
                backgroundColor: "#1E1E1E",
                color: "#D2D3D5",
                borderRadius: 10,
                padding: 10,
                height: 64
              }}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500">{errors.name.message}</Text>
        )}
      </View>

      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          What's your username?
        </Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="..."
              placeholderTextColor={'#D2D3D5'}
              style={{
                backgroundColor: "#1E1E1E",
                color: "#D2D3D5",
                borderRadius: 10,
                padding: 10,
                height: 64
              }}
            />
          )}
        />
        {errors.username && (
          <Text className="text-red-500">{errors.username.message}</Text>
        )}
      </View>

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

      <AppButton.Secondary 
        onPress={handleSubmit(onSubmit)} 
        text="Continue"
        color='#FF7A1B'
      />
    </View>
  );
};

export default UserDetail;