import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '../hooks/useQuery';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('Daily Mix 1');
  const [isPublic, setIsPublic] = useState(true);
  const navigation = useNavigation();
  const { createPlaylist, retrieveUserId } = useQuery();

  // Function to handle the create button press
  const handleCreatePlaylist = async () => {
    try {
      const user = await retrieveUserId();
      const response = await createPlaylist(
        playlistName,
        user as string
    );
      if (response) {
        Alert.alert("Success", "Playlist created successfully!");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create playlist. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="close-outline" size={30} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title} className='font-PlusJakartaSansMedium'>Give your playlist a name</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Playlist Name"
          value={playlistName}
          onChangeText={setPlaylistName}
          className='font-PlusJakartaSansBold text-[28px]'
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreatePlaylist}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    color: '#ffffff',
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#FF6D1B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePlaylist;
