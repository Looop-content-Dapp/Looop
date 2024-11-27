import { Dimensions, Platform, Text } from "react-native";
import { Image, Modal, TouchableOpacity, View } from "react-native";

const TribesInfoModal = ({ visible, onClose, onNext }) => {
    const screenDimensions = Dimensions.get('window');
    const modalHeight = screenDimensions.height * 0.6;
    const modalWidth = screenDimensions.width * 0.9;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: modalHeight,
              width: modalWidth,
              backgroundColor: '#12141B',
              borderRadius: 24,
              overflow: 'hidden',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}
          >
            <View style={{
              flex: 1,
              alignItems: 'flex-start',
              position: 'relative',
              paddingHorizontal: 20,
              paddingTop: 20
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%'
              }}>
                <Image
                  source={require("../../assets/images/musicNote.png")}
                  style={{
                    width: 106,
                    height: 106,
                    resizeMode: 'cover',
                    marginRight: -40
                  }}
                />
                <Image
                  source={require("../../assets/images/userGroup.png")}
                  style={{
                    width: 106,
                    height: 106,
                    resizeMode: 'cover',
                    zIndex: 1
                  }}
                />
              </View>
              <View style={{ gap: 8, marginTop: 21 }}>
                <Text style={{
                  fontSize: 24,
                  color: '#f4f4f4',
                  fontFamily: 'PlusJakartaSansBold'
                }}>What's Tribes?</Text>
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSansRegular',
                  color: '#D2D3D5'
                }}>Tribes are a cool way to engage with your fans on a much deeper level.</Text>

                <View style={{ gap: 8 }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSansRegular',
                    color: '#D2D3D5'
                  }}>With Tribes, you can:</Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSansRegular',
                    color: '#D2D3D5'
                  }}>• Keep fans in the loop with your latest updates and announcements.</Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSansRegular',
                    color: '#D2D3D5'
                  }}>• Demo new music.</Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSansRegular',
                    color: '#D2D3D5'
                  }}>• Offer exclusive content and perks to your most engaging fans.</Text>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSansRegular',
                    color: '#D2D3D5'
                  }}>• Provide access on your own terms.</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onNext}
                style={{
                  backgroundColor: '#A187B5',
                  paddingVertical: 16,
                  width: '100%',
                  alignItems: 'center',
                  borderRadius: 56,
                  marginTop: screenDimensions.height * 0.15,
                  bottom: Platform.OS === 'ios' ? 90 : 30,
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'PlusJakartaSansMedium',
                  color: '#12141B',
                }}>
                  Build my Tribe
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  export default TribesInfoModal
