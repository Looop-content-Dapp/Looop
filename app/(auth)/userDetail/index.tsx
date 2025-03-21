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
          <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
            Enter date of birth
          </Text>
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={[
                    styles.datePickerButton,
                    errors.dob ? styles.errorBorder : {},
                  ]}
                >
                  <Text style={styles.datePickerText}>
                    {value ? format(new Date(value), "MMMM dd, yyyy") : "Select Date"}
                  </Text>
                </TouchableOpacity>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showPicker}
                  onRequestClose={() => setShowPicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <TouchableOpacity
                          onPress={() => setShowPicker(false)}
                          style={styles.closeButton}
                        >
                          <Text style={styles.closeButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        mode="single"
                        date={selected}
                        onChange={({ date }) => {
                          setSelected(date);
                          onChange(format(date, "yyyy-MM-dd"));
                          setShowPicker(false);
                        }}
                        styles={{
                          month: {
                            color: '#F4F4F4',
                            fontSize: 20,
                            fontFamily: 'PlusJakartaSansBold',
                            letterSpacing: 0.5,
                          },
                          weekdays: {
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginBottom: 16,
                            paddingHorizontal: 8,
                          },
                          weekday: {
                            color: '#787A80',
                            fontSize: 13,
                            width: 45,
                            textAlign: 'center',
                            fontFamily: 'PlusJakartaSansMedium',
                            textTransform: 'uppercase',
                          },
                          day: {
                            width: 45,
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 2,
                            borderRadius: 22.5,
                          },
                          day_label: {
                            color: '#F4F4F4',
                            fontSize: 15,
                            fontFamily: 'PlusJakartaSansMedium',
                          },
                          today: {
                            backgroundColor: 'rgba(255, 122, 27, 0.1)',
                            borderWidth: 1,
                            borderColor: '#FF7A1B',
                          },
                          today_label: {
                            color: '#FF7A1B',
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          selected: {
                            backgroundColor: '#FF7A1B',
                            borderRadius: 22.5,
                          },
                          selected_label: {
                            color: '#FFFFFF',
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          button_prev: {
                            backgroundColor: '#F4F4F4',
                            borderRadius: 12,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          button_next: {
                            backgroundColor: '#F4F4F4',
                            borderRadius: 12,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          disabled: {
                            opacity: 0.3,
                          },
                          disabled_label: {
                            color: '#787A80',
                          },
                          outside_label: {
                            color: '#787A80',
                            opacity: 0.3,
                          },
                          weekday_label: {
                            color: "#787A80",
                            fontSize: 13,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          },
                          month_label: {
                            color: "#F4F4F4",
                            fontSize: 20,
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          months: {
                            borderRadius: 12,
                            padding: 12,
                          },
                          selected_month_label: {
                            color: '#FF7A1B',
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          month_selector_label: {
                            color: '#F4F4F4',
                            fontSize: 16,
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          month_selector: {
                            borderRadius: 12,
                            padding: 16,
                          },
                          year_selector: {
                            borderRadius: 12,
                            padding: 16,
                          },
                          year_selector_label: {
                            color: '#F4F4F4',
                            fontSize: 16,
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          year_label: {
                            color: '#F4F4F4',
                            fontSize: 16,
                            fontFamily: 'PlusJakartaSansBold',
                          },
                          selected_year_label: {
                            color: '#FF7A1B',
                            fontFamily: 'PlusJakartaSansBold',
                          }
                        }}
                      />
                    </View>
                  </View>
                </Modal>
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
                        ? genderOptions.find((option) => option.value === value)?.label
                        : "Select Gender"}
                    </Text>
                  </View>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={styles.dropdownContent}>
                  {genderOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => onChange(option.value)}
                      style={[
                        styles.dropdownItem,
                        value === option.value ? styles.selectedItem : {},
                      ]}
                    >
                      <DropdownMenuItemTitle
                        style={[
                          styles.itemText,
                          value === option.value && styles.selectedItemText,
                        ]}
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
