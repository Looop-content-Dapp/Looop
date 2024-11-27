import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StepIndicator = ({ currentStep, STEPS }) => {
  const getStepStatus = (step) => {
    const stepOrder = [STEPS.BASIC, STEPS.MEMBERSHIP, STEPS.PREVIEW];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const renderStepIndicator = (step, number) => {
    const status = getStepStatus(step);

    if (status === 'completed') {
      return (
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#4ADE80',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <MaterialIcons name="check" size={16} color="#12141B" />
        </View>
      );
    }

    if (status === 'current') {
      return (
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#A187B5',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            color: '#12141B',
            fontSize: 14,
            fontFamily: 'PlusJakartaSansMedium',
          }}>
            {number}
          </Text>
        </View>
      );
    }

    return (
      <View style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1C1F2A',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: '#9CA3AF',
          fontSize: 14,
          fontFamily: 'PlusJakartaSansMedium',
        }}>
          {number}
        </Text>
      </View>
    );
  };

  const renderConnector = (step) => {
    const status = getStepStatus(step);
    return (
      <View style={{
        flex: 1,
        height: 2,
        backgroundColor: status === 'completed' ? '#4ADE80' : '#1C1F2A',
        marginHorizontal: 8,
      }} />
    );
  };

  const getStepTextColor = (step) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed':
        return '#4ADE80';
      case 'current':
        return '#f4f4f4';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <View style={{
      paddingHorizontal: 16,
      marginVertical: 16,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Basic Step */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderStepIndicator(STEPS.BASIC, 1)}
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontFamily: 'PlusJakartaSansMedium',
            color: getStepTextColor(STEPS.BASIC),
          }}>
            Basic
          </Text>
        </View>

        {renderConnector(STEPS.BASIC)}

        {/* Membership Step */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderStepIndicator(STEPS.MEMBERSHIP, 2)}
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontFamily: 'PlusJakartaSansMedium',
            color: getStepTextColor(STEPS.MEMBERSHIP),
          }}>
            Membership
          </Text>
        </View>

        {renderConnector(STEPS.MEMBERSHIP)}

        {/* Preview Step */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderStepIndicator(STEPS.PREVIEW, 3)}
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontFamily: 'PlusJakartaSansMedium',
            color: getStepTextColor(STEPS.PREVIEW),
          }}>
            Preview
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StepIndicator;
