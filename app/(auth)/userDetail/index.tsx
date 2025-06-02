import {
    View,
    Text,
    StyleSheet,
    Platform,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import AuthHeader from "@/components/AuthHeader";
  import { AppButton } from "@/components/app-components/button";
  import { useForm, Controller } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { format } from "date-fns";
  import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from "react-native-responsive-screen";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { DateType, useDefaultStyles } from "react-native-ui-datepicker";
  import { DatePicker } from "@/components/ui/date-picker";
  import { Select } from "@/components/ui/select";

  // Form schema validation using zod
  const schema = z.object({
    dob: z
      .string({
        message: "Date of birth is required",
      })
      .nonempty({ message: "Date of birth is required" }),
    gender: z
      .string({
        message: "Gender is required",
      })
      .nonempty({ message: "Gender is required" }),
  });

  // Pre-defined gender options
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // Type for form data
  type FormData = {
    dob: string;
    gender: string;
  };

  const UserDetail = () => {
    // Get URL params, making sure to parse them correctly
    const params = useLocalSearchParams();
    const email = params.email as string;
    const password = params.password as string;
    const oauthProvider = params.oauthProvider as "google" | "apple" | "xion" | "argent" | undefined;
    const walletAddress = params.walletAddress as string;

    // Log parameters for debugging
    useEffect(() => {
      console.log("Parameters:", { email, password, oauthProvider, walletAddress });
    }, [email, password, oauthProvider, walletAddress]);

    const router = useRouter();
    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();

    // Initialize form with default values and resolver
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        dob: "",
        gender: "",
      },
    });

    // Handle form submission
    const onSubmit = (data: FormData) => {
      console.log("Form data:", data);
      // Ensure we pass all parameters to the next screen
      router.navigate({
        pathname: "/(auth)/enterUserName",
        params: {
          email,
          password,
          oauthProvider,
          walletAddress,
          dob: data.dob,
          gender: data.gender
        },
      });
    };

    return (
      <View className="flex-1 px-6 gap-12">
        <AuthHeader
          title="Tell Us About Yourself"
          description="Just a few more details to personalize your experience!"
        />

        <View className="gap-y-[32px]">
          {/* Date of Birth Field */}
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Date of Birth"
                description="We'll use this to verify your age"
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(format(date, 'yyyy-MM-dd'))}
                error={errors.dob?.message}
                maximumDate={new Date()}
              />
            )}
          />

          {/* Gender Field */}
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Gender"
                description="Choose your gender identity"
                options={genderOptions}
                value={value}
                onValueChange={onChange}
                error={errors.gender?.message}
              />
            )}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.bottomButtonContainer}>
          <AppButton.Secondary
            onPress={handleSubmit(onSubmit)}
            text="Continue"
            color="#FF7A1B"
          />
        </View>
      </View>
    );
  };

  export default UserDetail;

  const styles = StyleSheet.create({
    bottomButtonContainer: {
      position: "absolute",
      bottom: hp("5%"),
      left: 0,
      right: 0,
      padding: 20,
    }
  });
