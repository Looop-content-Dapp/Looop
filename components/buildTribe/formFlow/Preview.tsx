import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useQuery } from '../../../hooks/useQuery'

const Preview = ({ formData }) => {
  return (
    <ScrollView style={{ flex: 1}}>
      {/* Header */}
      <View style={{ height: 200 }}>
        <Image
          source={{ uri: formData?.coverImage?.uri }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover'
          }}
        />
      </View>

      {/* Tribe Info */}
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 10
        }}>
          {formData?.tribeName}
        </Text>

        <Text style={{
          fontSize: 16,
          color: '#FFFFFF',
          opacity: 0.8,
          marginBottom: 30
        }}>
          {formData?.description}
        </Text>

        {/* Tribe Pass Section */}
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 20
        }}>
          Tribe pass
        </Text>

        {/* Pass Card */}
        <View style={{
          backgroundColor: '#161616',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 30
        }}>
          <Image
            source={{ uri: formData?.collectibleMedia?.uri }}
            style={{
              width: '100%',
              height: 300,
              resizeMode: 'cover'
            }}
          />

          <View style={{ padding: 20 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10
            }}>
              <Text style={{
                color: '#FF8C00',
                backgroundColor: 'rgba(255, 140, 0, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                overflow: 'hidden',
                fontSize: 14,
                marginRight: 10
              }}>
                🔥 Tribe Pass
              </Text>
            </View>

            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: 8
            }}>
              {formData?.collectibleName}
            </Text>

            <Text style={{
              fontSize: 16,
              color: '#FFFFFF',
              opacity: 0.8
            }}>
              {formData?.CollectibleDescription}
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  )
}

export default Preview
