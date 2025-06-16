import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

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
          <ActivityIndicator size="large" color="#FF6D1B" />
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: '#1A1C23', // Dark background for the modal content
    height: '100%', // Changed to full height
    width: '100%', // Changed to full width
    borderRadius: 0, // Optional: remove border radius if it's full screen
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    marginTop: 15,
    fontSize: 16,
    color: '#E0E0E0', // Light text color for contrast
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
});

export default LoadingModal;