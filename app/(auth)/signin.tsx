import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
;
import { AppButton } from "@/components/app-components/button";
import { StatusBar } from "expo-status-bar";
import { router, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendEmailOTP } from "@/hooks/useVerifyEmail";
import AuthHeader from "@/components/AuthHeader";





const schema = z.object({
  email: z.string({
    message: "Please enter a valid email address",
  }).email({
    message: "Please enter a valid email address",
  }).nonempty({
    message: "Email is required",
  }),
});
const Signin = () => {
  const router = useRouter();
  const { mutate: sendOtpEmail, isPending } = useSendEmailOTP();

  const { control, handleSubmit, formState: { errors }, } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: { email: string }) => {

    sendOtpEmail(data, {
      onSuccess: () => {
        router.navigate({ pathname: "/(auth)/verifyEmail", params: { email: data.email } });
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });

  }


  return (
    
    


    <View className="flex-1 px-6 gap-12">

      <View className="gap-y-20">
        <AuthHeader
        title="Welcome to Looop"
        description="We&rsquo;re excited to have you in the looop. Are you ready for an amazing experience? Let&rsquo;s get you started!"
        />

        <View className="gap-y-3">
          <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
            What&rsquo;s your Email?
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  backgroundColor: "#1E1E1E",
                  color: "#D2D3D5",
                  borderRadius: 10,
                  padding: 10,
                }}
                className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email Address"
                placeholderTextColor="#787A80"
                keyboardType="email-address"
                inputMode="email"
                keyboardAppearance="dark"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors?.email && (
            <Text className="text-red-500 text-sm font-PlusJakartaSansRegular"
            >{errors.email.message}</Text>
          )}


        </View>

        <AppButton.Secondary
          color="#FF7A1B"
          text="Continue"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}

        />

        <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
          Or you can sign in with
        </Text>
      </View>


      <View className="flex-col gap-y-4">
        <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}
          className="flex-row items-center justify-center gap-x-4 bg-white px-4 py-2 rounded-full w-full">

          <Image
            source={require("../../assets/images/google.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text className="text-[#040405] font-PlusJakartaSansMedium text-[14px]">
            Sign in with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}
          className="flex-row items-center justify-center gap-x-4 bg-white px-4 py-2 rounded-full w-full">
          <Image
            source={require("../../assets/images/apple.png")}
            style={{ width: 40, height: 40, }}
          />
          <Text className="text-[#040405] font-PlusJakartaSansMedium text-[14px]">
            Sign in with Apple
          </Text>
        </TouchableOpacity>
      </View>


    </View>

  );
};

export default Signin;
