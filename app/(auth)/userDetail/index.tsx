import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import { AppButton } from "@/components/app-components/button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
      message: "gender is required",
    })
    .nonempty({ message: "Gender is required" }),
});

const genderOptions = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];

const UserDetail = () => {
  const { email, password } = useLocalSearchParams<{
    email: string;
    password: string;
  }>();
  const router = useRouter();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

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

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.navigate({
      pathname: "/(auth)/enterUserName",
      params: { email, password, ...data },
    });
  };

  return (
    <View className="flex-1 px-6 gap-12">
      <AuthHeader
        title="Tell Us About Yourself"
        description="Just a few more details to personalize your experience!"
      />

      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          Enter date of birth
        </Text>
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}
                style={[
                  styles.datePickerButton,
                  errors.dob ? styles.errorBorder : {},
                ]}
              >
                <Text style={styles.datePickerText}>
                  {value ? value : "Select Date"}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  setDatePickerVisible(false);
                  onChange(format(date, "yyyy-MM-dd"));
                }}
                onCancel={() => setDatePickerVisible(false)}
                maximumDate={new Date()} // Set maximum date as today
                date={value ? new Date(value) : new Date()}
                buttonTextColorIOS="#FF7A1B"
                accentColor="#FF7A1B"
                backdropStyleIOS={{ backgroundColor: "#1E1E1E" }}
                pickerStyleIOS={{ backgroundColor: "#1E1E1E" }}
                textColor="#D2D3D5"
                themeVariant="dark"
              />
            </>
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
          render={({ field: { onChange, value } }) => (
            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <View
                  style={[
                    styles.dropdownTrigger,
                    errors.gender ? styles.errorBorder : {},
                  ]}
                >
                  <Text style={styles.dropdownTriggerText}>
                    {value
                      ? genderOptions.find((option) => option.value === value)
                          ?.label
                      : "Select"}
                  </Text>
                </View>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={styles.dropdownContent}>
                {genderOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                    }}
                    // @ts-expect-error: style prop is not defined in DropdownMenuItem
                    style={[
                      styles.dropdownItem,
                      value === option.value ? styles.selectedItem : {},
                    ]}
                  >
                    <DropdownMenuItemTitle
                      style={
                        value === option.value
                          ? styles.selectedItemText
                          : styles.itemText
                      }
                    >
                      {option.label}
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenuRoot>
          )}
        />
        {errors.gender && (
          <Text className="text-red-500">{errors.gender.message}</Text>
        )}
      </View>

      <View style={styles.buttomButtonContainer}>
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
  buttomButtonContainer: {
    position: "absolute",
    bottom: hp("5%"),
    left: 0,
    right: 0,
    padding: 20,
  },
  datePickerButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D2D2D",
  },
  datePickerText: {
    color: "#D2D3D5",
    fontFamily: "PlusJakartaSansMedium",
    fontSize: 16,
  },
  dropdownTrigger: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D2D2D",
  },
  errorBorder: {
    borderColor: "#FF4D4F",
    borderWidth: 1,
  },
  dropdownTriggerText: {
    color: "#D2D3D5",
    fontFamily: "PlusJakartaSansMedium",
    fontSize: 16,
  },
  dropdownContent: {
    backgroundColor: "#252525",
    borderRadius: 10,
    marginTop: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: "rgba(255, 122, 27, 0.15)",
  },
  itemText: {
    color: "#D2D3D5",
    fontFamily: "PlusJakartaSansMedium",
    fontSize: 16,
  },
  selectedItemText: {
    color: "#FF7A1B",
    fontFamily: "PlusJakartaSansBold",
    fontSize: 16,
  },
});
