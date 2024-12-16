import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CdIcon, FileUploadIcon, Playlist02Icon, Vynil03Icon } from '@hugeicons/react-native'
import { useRouter } from 'expo-router'


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const baseWidth = 390
const scale = Math.min(SCREEN_WIDTH / baseWidth, 1.2)
const responsiveSize = (size: number) => {
  const scaledSize = Math.round(size * scale)
  return Math.max(scaledSize, size * 0.7)
}

const isIOS = Platform.OS === 'ios'

const index = () => {
 const { push } = useRouter()
  const [currentScreen, setCurrentScreen] = useState<'initial' | 'uploadType'>('initial')
  const [selectedType, setSelectedType] = useState<'Single' | 'EP' | 'Album' | null>(null)
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window')
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ window })
    })

    return () => subscription?.remove()
  }, [])

  const gridItemWidth = Math.min(
    (dimensions.window.width - responsiveSize(60)) / 2,
    180
  )

  const uploadTypes = [
    {
      id: 'Single',
      icon: CdIcon,
      text: 'Single',
      route: 'uploadMusic/uploadAlbum'
      },
    {
      id: 'EP',
      icon: Playlist02Icon,
      text: 'EP',
      route: 'uploadMusic/uploadEp'
    },
    {
      id: 'Album',
      icon: Vynil03Icon,
      text: 'Album',
      route: 'uploadMusic/uploadAlbum'
    }
  ]

  const handleTypeSelect = (type: 'Single' | 'EP' | 'Album') => {
    setSelectedType(type)
  }

  const handleContinue = () => {
    if (selectedType) {
      const selectedUploadType = uploadTypes.find(type => type.id === selectedType);
      if (selectedUploadType) {
        try {
          push(selectedUploadType.route);
        } catch (error) {
          Alert.alert('Navigation error:');
        }
      }
    }
  };

  const renderInitialScreen = () => (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        <View style={[styles.iconContainer, {
          width: responsiveSize(140),
          height: responsiveSize(140),
        }]}>
          <FileUploadIcon
            size={responsiveSize(48)}
            color='#57E09A'
            variant='solid'
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Uploading music on Looop</Text>
            <Text style={styles.subHeading}>
              You're all set to share your music with everyone, and we've made it super easy for you!
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>You can now:</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>◇ Choose upload types</Text>
              <Text style={styles.featureItem}>◇ Add features</Text>
              <Text style={styles.featureItem}>◇ Include necessary metadata</Text>
              <Text style={styles.featureItem}>◇ Upload your own cover art</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => setCurrentScreen('uploadType')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  const renderUploadTypeScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('initial')}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Upload Type</Text>
          <Text style={styles.subtitle}>Select from the upload types</Text>

          <View style={styles.uploadTypeGrid}>
            {uploadTypes.map((item, index) => {
              const isSelected = selectedType === item.id
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.uploadTypeCard,
                    {
                      width: gridItemWidth,
                      height: gridItemWidth
                    },
                    isSelected && styles.selectedCard
                  ]}
                  onPress={() => handleTypeSelect(item.id as 'Single' | 'EP' | 'Album')}
                >
                  <View style={[styles.uploadTypeIconContainer, {
                    transform: [{ scale: scale }]
                  }]}>
                    <item.icon
                      size={responsiveSize(120)}
                      color={isSelected ? '#57E09A' : '#787A80'}
                      variant='solid'
                    />
                  </View>
                  <Text style={[
                    styles.uploadTypeText,
                    isSelected && styles.selectedText
                  ]}>{item.text}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

<View style={styles.buttonWrapper}>
 <TouchableOpacity
    style={[
      styles.continueButton,
      !selectedType && styles.disabledButton
    ]}
    onPress={handleContinue}
    disabled={!selectedType}
  >
    <Text style={styles.buttonText}>Continue</Text>
  </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )

  return currentScreen === 'initial' ? renderInitialScreen() : renderUploadTypeScreen()
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: responsiveSize(16),
    paddingBottom: responsiveSize(80),
  },
  iconContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.08,
  },
  contentContainer: {
    marginTop: responsiveSize(32),
    gap: responsiveSize(24)
  },
  textContainer: {
    gap: responsiveSize(8)
  },
  heading: {
    fontSize: responsiveSize(24),
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF'
  },
  subHeading: {
    fontSize: responsiveSize(14),
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#D2D3D5',
    lineHeight: responsiveSize(20)
  },
  featureCard: {
    padding: responsiveSize(24),
    backgroundColor: '#12141B',
    borderRadius: responsiveSize(16),
    gap: responsiveSize(16)
  },
  featureTitle: {
    fontSize: responsiveSize(16),
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#787A80'
  },
  title: {
    fontSize: responsiveSize(24),
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#FFFFFF',
    marginTop: responsiveSize(16),
  },
  subtitle: {
    fontSize: responsiveSize(14),
    color: '#AAAAAA',
    marginTop: responsiveSize(4),
    lineHeight: responsiveSize(20),
  },
  featureList: {
    gap: responsiveSize(12),
  },
  featureItem: {
    fontSize: responsiveSize(14),
    color: '#FFFFFF',
    fontFamily: "PlusJakartaSans-Regular",
  },
  buttonWrapper: {
    padding: responsiveSize(16),
    paddingBottom: isIOS ? responsiveSize(32) : responsiveSize(16),
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  continueButton: {
    backgroundColor: '#4ADE80',
    borderRadius: responsiveSize(30),
    height: responsiveSize(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDark: {
    backgroundColor: '#1E1E1E',
  },
  darkButtonText: {
    color: '#FFFFFF',
  },
  backButton: {
    width: responsiveSize(32),
    height: responsiveSize(32),
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: responsiveSize(20),
    color: '#FFFFFF',
  },
  uploadTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: responsiveSize(16),
    gap: responsiveSize(16),
  },
  uploadTypeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: responsiveSize(16),
    padding: responsiveSize(12),
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#57E09A',
  },
  uploadTypeIconContainer: {
    position: 'absolute',
    top: responsiveSize(-20),
    right: responsiveSize(-20),
    opacity: 0.5,
  },
  uploadTypeText: {
    fontSize: responsiveSize(16),
    color: '#F4F4F4',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  selectedText: {
    color: '#57E09A',
  },
//   buttonWrapper: {
//     paddingHorizontal: 16,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 24,
//     paddingTop: 8,
//     backgroundColor: 'transparent',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
  buttonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  disabledButton: {
    opacity: 0.5,
  },
})

export default index
