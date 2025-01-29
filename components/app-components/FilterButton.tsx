import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { ArrowDown01Icon } from "@hugeicons/react-native";

interface ModalPosition {
  top: number;
  right: number;
}

export interface FilterButtonProps {
  /** Array of options to display in the dropdown */
  options: string[];
  /** Currently selected option */
  selectedOption: string;
  /** Callback function when an option is selected */
  onOptionSelect: (option: string) => void;
  /** Optional icon component to display before the text */
  icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  options = [],
  selectedOption,
  onOptionSelect,
  icon,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({ top: 0, right: 0 });
  const buttonRef = useRef<typeof TouchableOpacity>(null);
  const { width } = useWindowDimensions();

  const handleFilterPress = (): void => {
    buttonRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      setModalPosition({
        top: py + height + 5,
        right: 20,
      });
      setIsModalVisible(true);
    });
  };

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={handleFilterPress}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.buttonText}>
          {selectedOption}
        </Text>
        <ArrowDown01Icon size={width * 0.06} color="#787A80" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={[styles.modalContainer, modalPosition]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  option === selectedOption && styles.selectedOption,
                  option === options[options.length - 1] && styles.lastOption
                ]}
                onPress={() => {
                  onOptionSelect(option);
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12141B',
    borderWidth: 2,
    borderColor: 'rgba(120, 122, 128, 0.7)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 4,
  },
  iconContainer: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#D2D3D5',
    fontFamily: 'PlusJakartaSansMedium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#0A0B0F',
    borderRadius: 10,
    overflow: 'hidden',
    width: 160,
    shadowColor: '#040405',
    shadowOffset: {
      width: 5,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(120, 122, 128, 0.2)',
  },
  selectedOption: {
    backgroundColor: '#12141B',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    color: '#f4f4f4',
    fontSize: 14,
    fontFamily: 'PlusJakartaSansMedium',
  },
});

export default FilterButton;
