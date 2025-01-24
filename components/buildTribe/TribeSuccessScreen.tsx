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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#12141B' }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <CheckmarkBadge01Icon
                   size={40}
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

        <View style={{
          backgroundColor: '#1C1F2A',
          borderRadius: 16,
          padding: 16,
          width: '100%',
          marginBottom: 32
        }}>
          <Image
            source={{ uri: tribeName?.coverImage }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 12,
              marginBottom: 16
            }}
          />
          <Text style={{
            color: '#fff',
            fontSize: 20,
            fontFamily: 'PlusJakartaSansBold'
          }}>
            {tribeName?.tribeName}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8
          }}>
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
