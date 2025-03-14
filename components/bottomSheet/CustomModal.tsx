import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    type?: 'default' | 'cancel' | 'destructive';
  }>;
  children?: React.ReactNode;
}

const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
  children,
}: CustomModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {message && <Text style={styles.message}>{message}</Text>}

          {children}

          {buttons.length > 0 && (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.type === 'cancel' && styles.cancelButton,
                    button.type === 'destructive' && styles.destructiveButton,
                  ]}
                  onPress={() => {
                    button.onPress();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.type === 'cancel' && styles.cancelButtonText,
                      button.type === 'destructive' && styles.destructiveButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#1D2029',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSansBold',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#202227',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSansMedium',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3E7BFA',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSansSemiBold',
  },
  cancelButton: {
    backgroundColor: '#202227',
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
});

export default CustomModal;
