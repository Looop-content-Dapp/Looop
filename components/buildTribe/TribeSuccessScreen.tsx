import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { FormData } from './formFlow/TribeForm';



type Prop = {
  tribeName: FormData
}


const TribeSuccessScreen = ({ tribeName  }: Prop) => {
  const { push } = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <CheckmarkBadge01Icon
                   size={71}
                   variant="solid"
                   color="#2DD881"
                 />
        <Text style={{
          color: '#fff',
          fontSize: 24,
          fontFamily: 'PlusJakartaSansBold',
          marginBottom: 8,
          textAlign: 'center'
        }}>
          Tribe pass minted
        </Text>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontFamily: 'PlusJakartaSansMedium',
          marginBottom: 24,
          textAlign: 'center'
        }}>
          Successfully
        </Text>

        <View className="bg-[#111318] rounded-[20px] overflow-hidden mb-[30px] p-2 border-[0.5px] border-[#63656B]">
          <Image
            source={{ uri: tribeName?.coverImage }}
            className="w-full h-[300px] object-cover"
          />

          <View className="flex-row items-center justify-between w-full px-[10px] py-[16px]">
            <Text className="text-[24px] font-PlusJakartaSansBold text-white mb-2">
              {tribeName?.tribeName}
            </Text>
            <View style={{
              backgroundColor: '#2EBD85',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                color: '#12141B',
                fontSize: 14,
                fontFamily: 'PlusJakartaSansMedium',
                marginRight: 4
              }}>
                Minted
                <CheckmarkBadge01Icon
                   size={16}
                   variant="solid"
                   color="#111318"
                 />
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#B9A5C8',
            width: '100%',
            padding: 16,
            borderRadius: 56,
            alignItems: 'center'
          }}
          onPress={() => push('/(artisteTabs)/(tribe)')}
        >
          <Text style={{
            color: '#12141B',
            fontSize: 16,
            fontFamily: 'PlusJakartaSansMedium'
          }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TribeSuccessScreen;
