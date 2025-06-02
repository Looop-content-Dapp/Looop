import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '../hooks/useQuery';
import { useNavigation } from 'expo-router';
import { useCreatePlaylist } from '@/hooks/usePlaylist';
import { useAppSelector } from '@/redux/hooks';
import { useNotification } from '@/context/NotificationContext';

const CreatePlaylist = () => {
  const { showNotification } = useNotification();
  const [playlistName, setPlaylistName] = useState('Daily Mix 1');
  const { userdata } = useAppSelector((auth) => auth.auth);
  const navigation = useNavigation();
  const createPlaylist = useCreatePlaylist();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the input when component mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      createPlaylist.mutate(
        {
          title: playlistName,
          userId: userdata?._id as string
        },
        {
          onSuccess: () => {
            showNotification({
              type: 'success',
              title: 'Success',
              message: 'Playlist created successfully!',
              position: 'bottom'
            });
            navigation.goBack();
          },
          onError: (error) => {
            showNotification({
              type: 'error',
              title: 'Error',
              message: 'Failed to create playlist. Please try again.',
              position: 'bottom'
            });
          }
        }
      );
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create playlist. Please try again.',
        position: 'bottom'
      });
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
          ref={inputRef}
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
