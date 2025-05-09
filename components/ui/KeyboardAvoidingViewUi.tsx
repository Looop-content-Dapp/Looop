import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  Animated,
  View
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardAvoidingBottomSheetProps extends Omit<BottomSheetProps, 'snapPoints'> {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  minHeight?: string | number;
  maxHeight?: string | number;
}

const KeyboardAvoidingViewUi: React.FC<KeyboardAvoidingBottomSheetProps> = ({
  children,
  isVisible,
  onClose,
  minHeight = '50%',
  maxHeight = '90%',
  ...rest
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  // Calculate snap points with and without keyboard
  const snapPoints = useMemo(() => {
    const basePoints = [minHeight, maxHeight];
    return basePoints;
  }, [minHeight, maxHeight, keyboardHeight]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      const keyboardHeight = event.endCoordinates.height;
      setKeyboardHeight(keyboardHeight);
      setIsKeyboardVisible(true);

      if (Platform.OS === 'ios') {
        Animated.timing(keyboardAnim, {
          toValue: keyboardHeight,
          duration: event.duration,
          useNativeDriver: false,
        }).start();
      } else {
        keyboardAnim.setValue(keyboardHeight);
      }

      // Ensure bottom sheet expands to max when keyboard appears
      bottomSheetRef.current?.snapToIndex(1);
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      setIsKeyboardVisible(false);

      if (Platform.OS === 'ios') {
        Animated.timing(keyboardAnim, {
          toValue: 0,
          duration: event.duration || 250,
          useNativeDriver: false,
        }).start();
      } else {
        keyboardAnim.setValue(0);
      }
    };

    const keyboardShowListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', handleKeyboardShow)
      : Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    const keyboardHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
      : Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // Update bottom sheet when visibility changes
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
      Keyboard.dismiss();
    }
  }, [onClose]);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  // Calculate content padding to handle the keyboard
  const contentContainerStyle = {
    paddingBottom: isKeyboardVisible ? keyboardHeight - (Platform.OS === 'ios' ? 0 : insets.bottom) : insets.bottom,
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      {...rest}
    >
      <Animated.View
        style={[
          styles.contentContainer,
          contentContainerStyle
        ]}
      >
        {children}
      </Animated.View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#121214',
  },
  handleIndicator: {
    backgroundColor: '#787A80',
    width: 40,
  },
  contentContainer: {
    flex: 1,
  },
});

export default KeyboardAvoidingViewUi;
