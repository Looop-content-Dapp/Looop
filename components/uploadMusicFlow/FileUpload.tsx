import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { FormField } from '../app-components/formField copy';



const FileUpload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [explicitLyrics, setExplicitLyrics] = useState('');
  const [writerName, setWriterName] = useState('');
  const [writers, setWriters] = useState([]);
  const [producer, setProducer] = useState('');
  const [producers, setProducers] = useState([]);
  const [isrc, setIsrc] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);

  const handleAddWriter = (name: string) => {
    if (name.trim() && !writers.includes(name)) {
      setWriters([...writers, name]);
      setWriterName('');
    }
  };

  const handleRemoveWriter = (name: string) => {
    setWriters(writers.filter(writer => writer !== name));
  };

  const handleAddProducer = (name: string) => {
    if (name.trim() && !producers.includes(name)) {
      setProducers([...producers, name]);
      setProducer('');
    }
  };

  const handleRemoveProducer = (name: string) => {
    setProducers(producers.filter(prod => prod !== name));
  };

  const explicitOptions = [
    { label: 'Yes, has explicit lyrics', value: 'yes' },
    { label: 'No explicit lyrics', value: 'no' },
  ];

  return (
    <>
    <FormField.AudioUploadField
  label="Attach file"
  description="Upload audio file"
  acceptedFormats="MP3, M4A, WAV, FLAC, WMA, AIFF"
  selectedFile={{
    name: 'untitled.wav',
    size: '20.64MB',
    duration: '03:23'
  }}
//   onFileSelect={handleFileSelect}
//   onFileRemove={handleFileRemove}
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
    </>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#12141B',
    borderRadius: 8,
  },
  noteText: {
    color: '#787A80',
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
});

export default FileUpload;
