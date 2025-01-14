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
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { ImageAdd02Icon } from "@hugeicons/react-native";
import Calendar from "./Calender";

// Enhanced interfaces
interface BaseFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  multiline?: boolean;
  numberOfLines?: number;
  onSubmitEditing?: () => void;
}

interface AudioUploadFieldProps extends BaseFieldProps {
  onFileSelect: () => void;
  acceptedFormats?: string;
  selectedFileName?: string;
}

interface DatePickerFieldProps extends BaseFieldProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  minDate?: Date;
  placeholder?: string;
  quickNote?: string;
}

interface PickerOption {
  label: string;
  value: string;
  icon?: string;
}

interface PickerFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  options: PickerOption[];
  searchPlaceholder?: string;
}

interface RadioOption {
  label: string;
  value: string;
}

interface RadioFieldProps extends BaseFieldProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

interface ImageUploadFieldProps extends BaseFieldProps {
  value?: string;
  onUpload: () => void;
  maxSize?: string;
  acceptedFormats?: string;
}

interface CreatorFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  selectedCreators: string[];
  onAddCreator: (creator: string) => void;
  onRemoveCreator: (creator: string) => void;
  buttonText?: string;
}

interface MultiSelectOption {
  label: string;
  value: string;
  icon?: string;
}

interface MultiSelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  values: string[];
  onSelect: (values: string[]) => void;
  options: MultiSelectOption[];
  searchPlaceholder?: string;
  maxSelections?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TextField = ({
  label,
  description,
  placeholder = "Enter value",
  value,
  onChangeText,
  error,
  required,
  secureTextEntry,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  onSubmitEditing
}: TextFieldProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.errorInput,
          multiline && { height: numberOfLines * 50, textAlignVertical: "top" }
        ]}
        placeholder={placeholder}
        placeholderTextColor="#787A80"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onSubmitEditing={onSubmitEditing}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const RadioField = ({
  label,
  description,
  options,
  value,
  onChange,
  error,
  required
}: RadioFieldProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.radioContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              value === option.value && styles.radioOptionSelected
            ]}
            onPress={() => onChange(option.value)}>
            <Text
              style={[
                styles.radioText,
                value === option.value && styles.radioTextSelected
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const CreatorField = ({
  label,
  description,
  placeholder = "looop.creator/profile-link",
  value,
  onChangeText,
  selectedCreators,
  onAddCreator,
  onRemoveCreator,
  error,
  required,
  buttonText
}: CreatorFieldProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.creatorInputContainer}>
        <TextInput
          style={[styles.creatorInput, error && styles.errorInput]}
          placeholder={placeholder}
          placeholderTextColor="#787A80"
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.creatorsContainer}>
          {selectedCreators.map((creator, index) => (
            <View key={index} style={styles.creatorTag}>
              <TouchableOpacity
                onPress={() => onRemoveCreator(creator)}
                style={styles.creatorTagRemove}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.creatorTagText}>{creator}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.addFeatureButton}
          onPress={() => value.trim() && onAddCreator(value)}>
          <Ionicons name="add" size={24} color="#A5A6AA" />
          <Text style={styles.addFeatureText}>
            {buttonText ? buttonText : "Add features"}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const ImageUploadField = ({
  label,
  description,
  value,
  onUpload,
  maxSize = "20MB",
  acceptedFormats = "JPEG",
  error,
  required
}: ImageUploadFieldProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}

      <View style={{ alignItems: "center" }}>
        {value ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: value }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.imageRemove}
              onPress={() => onUpload()}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadContainer} onPress={onUpload}>
            <ImageAdd02Icon size={40} color="#787A80" variant="stroke" />
            <Text
              style={
                styles.uploadText
              }>{`${acceptedFormats}, Max ${maxSize}`}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const DatePickerField = ({
  label,
  description,
  value,
  onSelect,
  error,
  required,
  placeholder = "Select date",
  quickNote
}: DatePickerFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const formattedDate = value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "";

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}

      <TouchableOpacity
        style={[styles.datePickerButton, error && styles.errorInput]}
        onPress={() => setModalVisible(true)}>
        <View style={styles.datePickerContent}>
          <Ionicons name="calendar-outline" size={24} color="#787A80" />
          <Text style={[styles.datePickerText, !value && styles.placeholder]}>
            {formattedDate || placeholder}
          </Text>
        </View>
      </TouchableOpacity>

      {quickNote && (
        <View style={styles.quickNoteContainer}>
          <Ionicons name="time-outline" size={20} color="#787A80" />
          <Text style={styles.quickNoteText}>{quickNote}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
              <Calendar
                selectedDate={value}
                onSelectDate={(date) => {
                  onSelect(date);
                  setModalVisible(false);
                }}
                minDate={new Date()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const AudioUploadField = ({
  label,
  description,
  onFileSelect,
  onFileRemove,
  acceptedFormats,
  selectedFile,
  error,
  required
}: AudioUploadFieldProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && (
        <Text style={styles.description}>
          {acceptedFormats ? `${description}\n${acceptedFormats}` : description}
        </Text>
      )}

      {selectedFile ? (
        <View style={styles.selectedFileContainer}>
          <View style={styles.fileInfoContainer}>
            <View style={styles.fileIconContainer}>
              <Ionicons name="document-outline" size={24} color="#787A80" />
            </View>
            <View style={styles.fileDetailsContainer}>
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileMetadata}>
                {selectedFile.duration && `${selectedFile.duration} • `}
                {selectedFile.size}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={onFileRemove}>
            <Ionicons name="close" size={20} color="#787A80" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.filePickerButton}
          onPress={onFileSelect}>
          <View style={styles.filePickerContent}>
            <Text style={styles.chooseFileText}>Choose file</Text>
            <Text style={styles.selectedFileText}>No file selected</Text>
          </View>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const PickerField = ({
  label,
  description,
  placeholder = "Select an option",
  value,
  onSelect,
  options,
  error,
  required,
  searchPlaceholder = "Search..."
}: PickerFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}

      <TouchableOpacity
        style={[styles.pickerButton, error && styles.errorInput]}
        onPress={() => setModalVisible(true)}>
        <View style={styles.selectedValueContainer}>
          {selectedOption?.icon && (
            <Image
              source={{ uri: selectedOption.icon }}
              style={styles.selectedIcon}
            />
          )}
          <Text
            style={[
              styles.pickerButtonText,
              !selectedOption && styles.placeholder
            ]}>
            {selectedOption?.label || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={24} color="#787A80" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#787A80" />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor="#787A80"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}>
                  {item.icon && (
                    <Image
                      source={{ uri: item.icon }}
                      style={styles.optionIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected
                    ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={24} color="#A187B5" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
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
  description,
  placeholder = "Select options",
  values,
  onSelect,
  options,
  error,
  required,
  searchPlaceholder = "Search...",
  maxSelections
}: MultiSelectFieldProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => values.includes(opt.value));

  const handleSelect = (value: string) => {
    if (values.includes(value)) {
      onSelect(values.filter((v) => v !== value));
    } else {
      if (maxSelections && values.length >= maxSelections) {
        return;
      }
      onSelect([...values, value]);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {description && <Text style={styles.description}>{description}</Text>}

      <TouchableOpacity
        style={[styles.pickerButton, error && styles.errorInput]}
        onPress={() => setModalVisible(true)}>
        <Ionicons name="search" size={24} color="#787A80" />
        <View style={styles.selectedValuesContainer}>
          {selectedOptions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedValuesScroll}>
              {selectedOptions.map((option) => (
                <View key={option.value} style={styles.selectedValueChip}>
                  {option.icon && (
                    <Image
                      source={{ uri: option.icon }}
                      style={styles.selectedValueIcon}
                    />
                  )}
                  <Text style={styles.selectedValueText}>{option.label}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#787A80" />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor="#787A80"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    values.includes(item.value) && styles.optionItemSelected
                  ]}
                  onPress={() => handleSelect(item.value)}>
                  <View style={styles.optionContent}>
                    {item.icon && (
                      <Image
                        source={{ uri: item.icon }}
                        style={styles.optionIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        values.includes(item.value) && styles.optionTextSelected
                      ]}>
                      {item.label}
                    </Text>
                  </View>
                  {values.includes(item.value) && (
                    <Ionicons name="checkmark" size={24} color="#9B6AD4" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export const FormField = {
  TextField,
  PickerField,
  RadioField,
  CreatorField,
  ImageUploadField,
  MultiSelectField,
  AudioUploadField,
  DatePickerField
};

const styles = StyleSheet.create({
  // Picker specific styles
  creatorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  creatorTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A187B5",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  creatorTagText: {
    color: "#12141B",
    marginRight: 8
  },
  creatorTagRemove: {
    padding: 2
  },
  creatorInputContainer: {
    flexDirection: "column",
    gap: 12
  },
  creatorInput: {
    backgroundColor: "transparent",
    borderRadius: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
    borderWidth: 2,
    borderColor: "#12141B"
  },
  addFeatureButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
    backgroundColor: "#12141B",
    borderRadius: 10
  },
  addFeatureText: {
    color: "#A5A6AA",
    fontSize: 14,
    fontWeight: "600"
  },
  errorInput: {
    borderColor: "#FF4D4F"
  },
  placeholder: {
    color: "#787A80"
  },
  pickerButton: {
    backgroundColor: "transparent",
    borderRadius: 56,
    borderWidth: 2,
    borderColor: "#12141B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    height: 64
  },
  pickerButtonText: {
    fontSize: 14,
    color: "#F4F4F4"
  },
  selectedValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent: {
    backgroundColor: "#12141B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: "70%"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600"
  },
  modalClose: {
    padding: 4
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12141B",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2C35"
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#FFFFFF"
  },
  optionsList: {
    maxHeight: "100%"
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1F25"
  },
  optionItemSelected: {
    backgroundColor: "#1E1F25"
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 4
  },
  optionText: {
    fontSize: 16,
    color: "#D2D3D5"
  },
  optionTextSelected: {
    color: "#9B6AD4"
  },
  container: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: "#F4F4F4",
    marginBottom: 8,
    fontWeight: "600"
  },
  required: {
    color: "#FF4D4F"
  },
  description: {
    fontSize: 14,
    color: "#787A80",
    marginBottom: 8,
    fontFamily: "PlusJakartaSans-Medium"
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "white",
    borderWidth: 2,
    borderColor: "#12141B"
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "#FF4D4F"
  },
  // Radio styles
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  radioOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#12141B"
  },
  radioOptionSelected: {
    backgroundColor: "#F4F4F4"
  },
  radioText: {
    color: "#A5A6AA",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
  radioTextSelected: {
    color: "#12141B",
    fontFamily: "PlusJakartaSans-Medium"
  },
  // Image upload styles
  imagePreviewContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative"
  },
  imagePreview: {
    width: "100%",
    height: "100%"
  },
  imageRemove: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4
  },
  uploadContainer: {
    width: 240,
    height: 240,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#12141B",
    justifyContent: "center",
    alignItems: "center"
  },
  uploadText: {
    color: "#787A80",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium"
  },
  selectedValuesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap"
  },
  selectedValuesScroll: {
    flexGrow: 0
  },
  selectedValueChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12141B",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginRight: 8
  },
  selectedValueIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 6
  },
  selectedValueText: {
    color: "#A5A6AA",
    fontSize: 14
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  filePickerButton: {
    backgroundColor: "#12141B",
    borderWidth: 2,
    borderColor: "#2A2C35",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    marginTop: 8
  },
  filePickerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  chooseFileText: {
    // color: "#9B6AD4",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#12141B",
    backgroundColor: "#787A80",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10
  },
  selectedFileText: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
  datePickerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#12141B",
    borderRadius: 56,
    padding: 16,
    marginTop: 8
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  datePickerText: {
    color: "#F4F4F4",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
  quickNoteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
    padding: 16,
    backgroundColor: "#12141B",
    borderRadius: 8
  },
  quickNoteText: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    flex: 1
  },
  calendarContainer: {
    padding: 16
  },
  selectedFileContainer: {
    backgroundColor: "#12141B",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8
  },
  fileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#1E1F25",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  fileDetailsContainer: {
    flex: 1
  },
  fileName: {
    color: "#F4F4F4",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 4
  },
  fileMetadata: {
    color: "#787A80",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium"
  },
  removeButton: {
    padding: 8
  }
});
