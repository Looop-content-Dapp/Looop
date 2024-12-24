import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";

interface PickerOption {
  label: string;
  value: string;
  icon?: string;
}

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  multiline?: boolean;
  numberOfLines?: number;
}

interface PickerFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  options: PickerOption[];
  error?: string;
}

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectFieldProps {
  label: string;
  placeholder?: string;
  selectedValues: MultiSelectOption[];
  onSelect: (values: MultiSelectOption[]) => void;
  options: MultiSelectOption[];
  error?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TextField = ({
  label,
  placeholder = "Enter value",
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
}: TextFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.errorInput,
          multiline && { height: numberOfLines * 50, textAlignVertical: "top" },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#787A80"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const PickerField = ({
  label,
  placeholder = "Select an option",
  value,
  onSelect,
  options,
  error,
}: PickerFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, error && styles.errorInput]}
        className="flex-row items-center justify-between"
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectedValueContainer}>
          {value && options.find((opt) => opt.label === value)?.icon && (
            <Image
              source={{ uri: options.find((opt) => opt.label === value)?.icon }}
              style={styles.selectedIcon}
            />
          )}
          <Text style={[styles.inputText, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={24} color="#787A80" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#787A80"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  {item.icon && (
                    <Image
                      source={{ uri: item.icon }}
                      style={styles.optionIcon}
                    />
                  )}
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const MultiSelectField = ({
  label,
  placeholder = "Type genre and press Enter",
  selectedValues,
  onSelect,
  options = [],
  error,
}: MultiSelectFieldProps) => {
  const [searchText, setSearchText] = useState("");

  const handleAdd = () => {
    const trimmedText = searchText.trim();
    if (!trimmedText) return;

    // Check if the entered text matches any option from the predefined list
    const matchingOption = options.find(
      (option) => option.label.toLowerCase() === trimmedText.toLowerCase()
    );

    if (matchingOption) {
      // Check if the genre is already selected
      const alreadySelected = selectedValues.some(
        (item) => item.value === matchingOption.value
      );

      if (!alreadySelected) {
        const newSelection = [...selectedValues, matchingOption];
        onSelect(newSelection);
      }
    }

    setSearchText("");
  };

  const handleRemove = (value: string) => {
    const updatedValues = selectedValues.filter((item) => item.value !== value);
    onSelect(updatedValues);
  };

  // Filter suggestions based on current input
  const filteredSuggestions = options
    .filter(
      (option) =>
        !selectedValues.find((item) => item.value === option.value) &&
        option.label.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(0, 4);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Selected Genres Display */}
      <ScrollView
        horizontal={false}
        style={styles.selectedScrollView}
        contentContainerStyle={styles.selectedContainer}
      >
        {selectedValues.map((item) => (
          <View key={item.value} style={styles.selectedItem}>
            <Text style={styles.selectedText}>{item.label}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.value)}
            >
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Input Field */}
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#787A80"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleAdd}
        />
      </View>

      {/* Error Message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Suggestions Dropdown */}
      {searchText.length > 0 && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.value}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchText(suggestion.label);
                handleAdd();
              }}
            >
              <Text style={styles.suggestionText}>{suggestion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const FormField = {
  TextField,
  PickerField,
  MultiSelectField,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#F4F4F4",
    marginBottom: 8,
    fontWeight: "600",
  },
  selectedScrollView: {
    maxHeight: 120,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
    borderWidth: 1,
    borderColor: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "gray",
  },
  errorInput: {
    borderColor: "#FF4D4F",
  },
  placeholder: {
    color: "#999",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "#FF4D4F",
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 16,
    color: "#D2D3D5",
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedText: {
    color: "#333",
    fontSize: 14,
    marginRight: 5,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    color: "#FF4D4F",
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  inputText: {
    color: "#F4F4F4",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#12141B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    height: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans-Bold",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1F25",
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 2,
  },
  selectedValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 2,
  },
});
