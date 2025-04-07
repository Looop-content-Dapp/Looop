import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal,
  } from "react-native";
  import React, { useState } from "react";
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
  import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuItemTitle,
  } from "@/components/DropDown";
  import DateTimePicker, { DateType, useDefaultStyles } from "react-native-ui-datepicker";
  import { Select } from "@/components/ui/select";
  import { DatePicker } from "@/components/ui/date-picker";

  type FormData = {
    dob: string;
    gender: string;
  };

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

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const UserDetail = () => {
    const [showPicker, setShowPicker] = useState(false);
    const { email, password, oauthProvider } = useLocalSearchParams<{
      email: string;
      password: string;
      oauthProvider?: "google" | "apple";
    }>();
    console.log(email, password, oauthProvider);
    const defaultStyles = useDefaultStyles();
    const [selected, setSelected] = useState<DateType>();
    const router = useRouter();

    const {
      control,
      handleSubmit,
      formState: { errors },
      watch,  // Add this
    } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        dob: "",
        gender: "",
      },
    });

    const onSubmit = (data: FormData) => {
      console.log(data);
      router.navigate({
        pathname: "/(auth)/enterUserName",
        params: { email, password, oauthProvider, ...data },
      });
    };

    return (
      <View className="flex-1 px-6 gap-12">
        <AuthHeader
          title="Tell Us About Yourself"
          description="Just a few more details to personalize your experience!"
        />


        <View className="gap-y-3">
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
              />
            )}
          />

           <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Gender"
                description="Select your gender"
                value={value || ''}  // Ensure value is never undefined
                options={genderOptions}
                onValueChange={(val) => {
                  console.log('Selected gender:', val); // Add logging
                  onChange(val);
                }}
                error={errors.gender?.message}
              />
            )}
          />
        </View>

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
    },
    datePickerButton: {
      backgroundColor: '#1E1E1E',
      borderRadius: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: '#2D2D2D',
      height: 56,
      justifyContent: 'center',
    },
    datePickerText: {
      color: '#D2D3D5',
      fontFamily: 'PlusJakartaSansMedium',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#12141B',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#2D2D2D',
    },
    modalTitle: {
      color: '#F4F4F4',
      fontSize: 18,
      fontFamily: 'PlusJakartaSansBold',
    },
    closeButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    closeButtonText: {
      color: '#FF7A1B',
      fontSize: 16,
      fontFamily: 'PlusJakartaSansMedium',
    },
    datePickerContainer: {
      backgroundColor: '#12141B',
      padding: 16,
    },
    datePickerHeader: {
      backgroundColor: '#1E1E1E',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    datePickerHeaderText: {
      color: '#F4F4F4',
      fontFamily: 'PlusJakartaSansBold',
      fontSize: 16,
    },
    datePickerMonthYear: {
      color: '#F4F4F4',
      fontFamily: 'PlusJakartaSansBold',
      fontSize: 18,
    },
    datePickerWeek: {
      backgroundColor: '#1E1E1E',
      borderRadius: 8,
      padding: 8,
      marginVertical: 8,
    },
    datePickerWeekDay: {
      color: '#787A80',
      fontFamily: 'PlusJakartaSansMedium',
      fontSize: 14,
    },
    datePickerDay: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    datePickerDayText: {
      color: '#D2D3D5',
      fontFamily: 'PlusJakartaSansMedium',
      fontSize: 16,
    },
    datePickerTodayText: {
      color: '#FF7A1B',
      fontFamily: 'PlusJakartaSansBold',
    },
    datePickerSelectedText: {
      color: '#FFFFFF',
      fontFamily: 'PlusJakartaSansBold',
    },
    datePickerSelectedDay: {
      backgroundColor: '#FF7A1B',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FF7A1B',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    dropdownTrigger: {
      backgroundColor: '#1E1E1E',
      borderRadius: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: '#2D2D2D',
      height: 56,
      justifyContent: 'center',
    },
    dropdownTriggerText: {
      color: '#D2D3D5',
      fontFamily: 'PlusJakartaSansMedium',
      fontSize: 16,
    },
    dropdownContent: {
      backgroundColor: '#1A1D26',
      borderRadius: 12,
      padding: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#2D2D2D',
      width: '100%',
    },
    dropdownItem: {
      padding: 12,
      borderRadius: 8,
      marginVertical: 2,
    },
    selectedItem: {
      backgroundColor: 'rgba(255, 122, 27, 0.1)',
    },
    itemText: {
      color: '#F4F4F4',
      fontSize: 16,
      fontFamily: 'PlusJakartaSansMedium',
    },
    selectedItemText: {
      color: '#FF7A1B',
      fontFamily: 'PlusJakartaSansBold',
    },
    errorBorder: {
      borderColor: '#FF4D4F',
      borderWidth: 1,
    },
  });
