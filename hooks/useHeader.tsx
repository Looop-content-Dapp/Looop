import { useAppSelector } from '@/redux/hooks';
import { Notification02Icon } from '@hugeicons/react-native';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { router } from 'expo-router';

export const useHeader = ({title}: {title: string}) => {
  const { userdata } = useAppSelector((state) => state.auth);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Start your morning with music";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Great afternoon for music";
    } else {
      return "Evening vibes huh?";
    }
  };

  return {
    headerLeft: () => (
      <View className="flex-row items-center gap-x-[10px]">
        {title ? (
          <Text className="text-2xl text-[#f4f4f4] font-PlusJakartaSansExtraBold">{title}</Text>
        ) : (
          <Text className="text-2xl text-[#f4f4f4] font-PlusJakartaSansExtraBold">{getGreeting()}</Text>
        )}
      </View>
    ),
    headerRight: () => (
      <View className="flex-row bg-red-400 items-center gap-x-[30px]">
        <Notification02Icon
          size={24}
          color="#787A80"
          variant="stroke"
          onPress={() => router.navigate("/notification") }
        />
        <Avatar
          source={{
            uri:
              userdata?.profileImage?.length === 0
                ? "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg"
                : userdata?.profileImage,
          }}
          size={40}
          rounded
          onPress={() => router.push("/(profile)") }
          avatarStyle={{
            borderWidth: 2,
            borderColor: "#FF7700",
          }}
        />
      </View>
    ),
    title: "",
  };
};
