import { showToast } from "@/components/ShowMessage";
import { useFollowArtist } from "@/hooks/artist/useFollowArtist";
import { useAppSelector } from "@/redux/hooks";
import { CheckmarkBadge01Icon, PlayIcon, Money02Icon, XVariableIcon, Notification01Icon } from "@hugeicons/react-native";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { formatNumber } from "../utils/ArstsisArr";
import { Image } from "react-native";

// Update the interface
interface ArtistInfoProps {
  image?: string;
  name: string; // We'll keep this in props but won't use it
  follow: string;
  desc: string;
  follower: string;
  isVerfied: string;
  index: string;
  isFollow: boolean; // Change to boolean
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({
  follow,
  name,
  follower,
  isVerfied,
  index,
  isFollow,
  desc,
  image
}) => {
  const [followed, setFollowed] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [tipLoading, setTipLoading] = useState(false);

  useEffect(() => {
    setFollowed(isFollow); // Update when prop changes
  }, [isFollow]);
  const { userdata } = useAppSelector((state) => state.auth);
  const { handleFollowArtist, isLoading } = useFollowArtist();

  const onFollowPress = async () => {
    if (!userdata?._id) {
      showToast("Please log in to follow artists", "error");
      return;
    }

    try {
      // Toggle the UI state immediately for better UX
      setFollowed((prev) => !prev);

      // Call the follow artist function from the hook
      const result = await handleFollowArtist(userdata?._id, index);

      // If the API call fails, revert the UI state
      if (result === null) {
        setFollowed((prev) => !prev);
        showToast("Failed to follow artist", "error");
      } else {
        // Log success
        console.log(
          `Successfully ${result ? "followed" : "unfollowed"} artist: ${name}`
        );
      }
    } catch (error) {
      // Revert UI state on error
      setFollowed((prev) => !prev);
      console.error("Error following artist:", error);
      showToast("Failed to follow artist", "error");
    }
  };

  const handleSendTip = async () => {
    if (!tipAmount || isNaN(Number(tipAmount)) || Number(tipAmount) <= 0) {
      showToast("Enter a valid tip amount", "error");
      return;
    }
    setTipLoading(true);
    // TODO: Implement actual tip logic here
    setTimeout(() => {
      setTipLoading(false);
      setTipModalVisible(false);
      setTipAmount("");
      showToast("Tip sent!", "success");
    }, 1200);
  };

  const renderVerificationBadge = () =>
    isVerfied && (
      <Pressable className="flex-row items-center">
        <CheckmarkBadge01Icon size={24} variant="solid" color="#2DD881" />
      </Pressable>
    );

  const renderFollowerInfo = () => (
    <View className="flex-row gap-x-2">
      <Text className="text-[14px] font-PlusJakartaSansMedium text-[#9A9B9F]">
        {formatNumber(follow)} Followers
      </Text>
      <Text className="text-[14px] font-PlusJakartaSansMedium text-[#9A9B9F]">
        {formatNumber(follower)} TribeStar
      </Text>
    </View>
  );

  const renderTipBottomSheet = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={tipModalVisible}
      onRequestClose={() => setTipModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-[#12141B] rounded-t-[20px] p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-[20px] font-PlusJakartaSansBold">Send USDC</Text>
            <TouchableOpacity
              onPress={() => setTipModalVisible(false)}
              className="p-2"
            >
              <XVariableIcon size={24} color="#63656B" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium mb-2">Amount (USDC)</Text>
            <View className="flex-row items-center bg-[#1E1F25] rounded-[12px] px-4 py-3">
              <TextInput
                value={tipAmount}
                onChangeText={setTipAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#63656B"
                className="flex-1 text-white text-[16px] font-PlusJakartaSansMedium"
              />
              <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium">USDC</Text>
            </View>
          </View>

          <View className="mb-6 bg-[#1E1F25] rounded-[12px] p-4 flex-row items-center justify-between">
            <Image source={{
                uri: image
            }} className="w-[72px] h-[72px] rounded-full" resizeMode="cover" />
            <View>
            <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium mb-2">Sending to</Text>
            <Text className="text-white text-[16px] font-PlusJakartaSansBold">{name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSendTip}
            disabled={tipLoading}
            className="bg-[#FF4D00] rounded-full py-4 items-center"
          >
            {tipLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[16px] font-PlusJakartaSansBold">Send Tip</Text>
            )}
          </TouchableOpacity>

          <View className="mt-4 items-center">
            <Text className="text-[#63656B] text-[12px] font-PlusJakartaSansMedium">
              Available Balance: {userdata?.wallets?.usdc?.balance || '0.00'} USDC
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="gap-y-[14px]">
      <View className="flex-row items-center justify-around ml-[14px]">
        <View className=" flex-1">{renderFollowerInfo()}</View>
        {userdata?.artist !== index && (
          <View className="flex-row items-center gap-x-3">
            <TouchableOpacity
              onPress={() => setTipModalVisible(true)}
              className="border  border-[#63656B] h-[35px] w-[35px] rounded-full items-center justify-center"
              accessibilityLabel="Tip Artist"
            >
              <Notification01Icon size={16} variant="solid" color="#63656B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTipModalVisible(true)}
              className="border  border-[#63656B] h-[35px] w-[35px] rounded-full items-center justify-center"
              accessibilityLabel="Tip Artist"
            >
              <Money02Icon size={16} variant="solid" color="#63656B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onFollowPress}
              disabled={isLoading}
              className={`border px-6 py-2.5 border-[#63656B] rounded-full items-center ${
                followed
                  ? "border-2 border-[#12141B] bg-Gr"
                  : "border-[#787A80] bg-transparent"
              }`}
            >
              <Text className="text-white text-[14px] font-PlusJakartaSansMedium font-normal">
                {followed ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {renderTipBottomSheet()}
    </View>
  );
};

export default ArtistInfo;
