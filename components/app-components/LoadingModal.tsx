import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import AnimatedLogoFill from '../animated/AnimatedLogoFill';
// Assuming you have an icon library like react-native-vector-icons or a custom icon component
// import Icon from 'react-native-vector-icons/Ionicons'; // Example, replace with your actual icon import

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const { width, height } = Dimensions.get('window');

const LoadingModal: React.FC<LoadingModalProps> = ({ visible, message = 'Processing transaction...' }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {/* Replace ActivityIndicator with a more engaging element if desired */}
          {/* For example, a custom animated SVG or a Lottie animation */}
         <AnimatedLogoFill />
          {/* Example of adding an icon - ensure you have the icon library setup */}
          {/* <Icon name="sync-circle-outline" size={80} color="#FF6D1B" style={styles.iconStyle} /> */}
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically and horizontally
    backgroundColor: '#040405', // Slightly darker semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: '#1A1C23', // Dark background for the modal content
    // Ensure it takes full screen or a significant portion, adjust as needed
    width: width, // Full width
    height: height, // Full height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center content within the wrapper
    padding: 30, // Increased padding
  },

  messageText: {
    marginTop: 25, // Increased margin for better spacing
    fontSize: 18, // Slightly larger font size
    color: '#E0E0E0', // Light text color for contrast
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-SemiBold', // Using a slightly bolder font weight
    paddingHorizontal: 20, // Add horizontal padding to prevent text from touching edges
  },
});

export default LoadingModal;
