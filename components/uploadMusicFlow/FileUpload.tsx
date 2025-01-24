import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import { Text } from "react-native";
import { FormField } from "../app-components/formField";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";

const FileUpload = () => {
  const { files, isLoading, error, setError, progress, pickFile, removeFile } =
    useFileUpload();

  const [audioFile, setAudioFile] = useState(null);
  const [explicitLyrics, setExplicitLyrics] = useState("");
  const [writerName, setWriterName] = useState("");
  const [writers, setWriters] = useState([]);
  const [producer, setProducer] = useState("");
  const [producers, setProducers] = useState([]);
  const [isrc, setIsrc] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);

  console.log("Mian error");
  console.log(!!error);

  const handleAddWriter = (name: string) => {
    if (name.trim() && !writers.includes(name)) {
      setWriters([...writers, name]);
      setWriterName("");
    }
  };

  const handleRemoveWriter = (name: string) => {
    setWriters(writers.filter((writer) => writer !== name));
  };

  const handleAddProducer = (name: string) => {
    if (name.trim() && !producers.includes(name)) {
      setProducers([...producers, name]);
      setProducer("");
    }
  };

  const handleRemoveProducer = (name: string) => {
    setProducers(producers.filter((prod) => prod !== name));
  };

  const explicitOptions = [
    { label: "Yes, has explicit lyrics", value: "yes" },
    { label: "No explicit lyrics", value: "no" }
  ];

  return (
    <>
      <FormField.AudioUploadField
        label="Attach file"
        description="Upload audio file"
        acceptedFormats="MP3, M4A, WAV, FLAC, WMA, AIFF"
        selectedFile={audioFile}
        onFileSelect={() => pickFile(FileType.AUDIO)}
        onFileRemove={removeFile}
      />

      <FormField.RadioField
        label="Does the song contain explicit lyrics?"
        options={explicitOptions}
        value={explicitLyrics}
        onChange={setExplicitLyrics}
      />

      <FormField.CreatorField
        label="Add Songwriter credits"
        description="You can give credit to songwriters here"
        placeholder="Ex: Peter Clement Jackson"
        value={writerName}
        onChangeText={setWriterName}
        selectedCreators={writers}
        onAddCreator={handleAddWriter}
        onRemoveCreator={handleRemoveWriter}
      />

      <FormField.CreatorField
        label="Add Producers"
        description="Include producers and composers"
        placeholder="looop.creator/creator.com"
        value={producer}
        onChangeText={setProducer}
        selectedCreators={producers}
        onAddCreator={handleAddProducer}
        onRemoveCreator={handleRemoveProducer}
      />

      <FormField.TextField
        label="ISRC (Optional)"
        description="For royalties tracking."
        placeholder="Song name here"
        value={isrc}
        onChangeText={setIsrc}
      />

      <FormField.DatePickerField
        label="Schedule release"
        description="Not ready to drop your new track just yet? You can plan a release schedule!"
        placeholder="Select date"
        value={releaseDate}
        onSelect={setReleaseDate}
        quickNote="All scheduled releases will be available to listeners at midnight on the specified release date, based on their local timezone."
      />
      {/* Loading Overlay */}
      {isLoading && (
        <Modal transparent visible={isLoading}>
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.overlayText}>Uploading to Cloud</Text>
          </View>
        </Modal>
      )}

      {/* Error Banner */}
      {/* {!!error && (
        <Modal visible={true}>
          <View style={styles.errorModal}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Upload Error</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                // onPress={handleRetry}
                style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setError(null)}
                style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#12141B",
    borderRadius: 8
  },
  noteText: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  overlayText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  },
  errorBanner: {
    padding: 16,
    backgroundColor: Platform.OS === "ios" ? "#ffcccb" : "#b00020",
    borderRadius: 4,
    marginTop: 16
  },
  errorText: {
    color: Platform.OS === "ios" ? "#000" : "#fff",
    fontSize: 14
  },
  errorModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0)"
  },
  errorContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    elevation: 5
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ff4d4f"
  },
  errorMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlign: "center"
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center"
  },
  retryText: {
    color: "#fff",
    fontSize: 16
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    width: "80%",
    alignItems: "center"
  },
  closeText: {
    color: "#333",
    fontSize: 16
  }
});

export default FileUpload;
