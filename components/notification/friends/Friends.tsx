import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Link05Icon } from "@hugeicons/react-native";
import * as Contacts from "expo-contacts";
import ShareModal from "@/components/modals/ShareModal";

const Friends = () => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleShare = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  return (
    <View className="items-center">
      <ImageBackground
        source={require("../../../assets/images/friends.png")}
        style={{ width: wp("90%") }}
        className="h-[160px] rounded-[24px] pt-[40px] pl-[20px] overflow-hidden"
      >
        <View className="">
          <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/07 leading-[30px]">
            Looop is fun-er with friends
          </Text>
          <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07 leading-[30px]">
            Invite friends and unlock future rewards!
          </Text>
        </View>
        <View className="absolute right-6 bottom-4">
          <TouchableOpacity onPress={handleShare} className="item bg-[#fff] px-[16px] py-[12px] flex-row items-center rounded-[24px] gap-x-[8px]">
            <Link05Icon size={16} color="#0A0B0F" variant="stroke" />
            <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07">
              Invite friends
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ShareModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        shareLink="https://example.com/share-link"
        shareTitle="Check this out!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Friends;
