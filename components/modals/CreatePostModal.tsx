import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from "react-native";
import { Image02Icon, Gif01Icon, VoiceIcon, Calendar01Icon} from "@hugeicons/react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Audio, Video } from 'expo-av';
import useFileUpload, { FileType, UploadedFile } from '../../hooks/useFileUpload';
import AudioWaveform from '../animated/AudioWaveForm';
import { useQuery } from '../../hooks/useQuery';

interface CreatePostBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  community?: any;
  defaultCategory?: PostCategory;
}

interface AudioState {
    uri: string;
    isPlaying: boolean;
    progress: number;
    sound: Audio.Sound | null;
  }

  // Define the proper types for categories
type PostCategory = 'artwork' | 'music' | 'photography' | 'design' | 'other';
type PostVisibility = 'public' | 'private' | 'unlisted';
type PostStatus = 'draft' | 'published' | 'archived';

const CreatePostModal = ({ isVisible, onClose, community, defaultCategory = 'other'  }: CreatePostBottomSheetProps) => {
  // States
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<PostCategory>(defaultCategory);

  // New audio-related states
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});

  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const videoRef = useRef<Video>(null);

  // Custom hook
  const { pickFile, removeFile, isLoading } = useFileUpload();
  const { createPost } = useQuery()

  // Variables
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  // Convert uploaded files to post media format
  const convertFilesToMediaFormat = (files: UploadedFile[]) => {
    return files.map(file => ({
      type: file.type.startsWith('image/')
        ? file.type === 'image/gif' ? 'gif' : 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'image',
      url: file.uri,
      mimeType: file.type,
      size: file.size,
      ...(file.width && { width: file.width }),
      ...(file.height && { height: file.height }),
      ...(file?.duration && { duration: file.duration })
    }));
  };

   // Handle post submission
   const handleCreatePost = async () => {
    if (isSubmitting) return;

    if (!selectedFiles.length) {
      Alert.alert('Error', 'Please add at least one media file');
      return;
    }

    try {
      setIsSubmitting(true);

      const postData = {
        content: postText.trim(),
        media: convertFilesToMediaFormat(selectedFiles),
        artistId: "",
        category: category as PostCategory,
        visibility: 'public' as PostVisibility,
        status: 'published' as PostStatus,
        tags: [] // You can add tags functionality if needed
      };
      console.log("postdata", postData)

    //   await createPost(postData);

      // Reset form and close modal
      setPostText('');
      setSelectedFiles([]);
      onClose();

      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        'Failed to create post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // File handling functions
  const handleFilePick = async (type: FileType) => {
    try {
      console.log('Picking file of type:', type);
      const result = await pickFile(type);
      console.log('Pick result:', result);
      if (result?.success && result.file) {
        setSelectedFiles(prev => {
          const newFile = result.file;
          return newFile ? [...prev, newFile] : prev;
        });
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };


 // Audio handling functions
 const handleAudioToggle = async (file: UploadedFile) => {
    try {
      const currentState = audioStates[file.uri];

      if (!currentState) {
        // Initialize audio if not loaded
        const { sound } = await Audio.Sound.createAsync(
          { uri: file.uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate(file.uri)
        );

        setAudioStates(prev => ({
          ...prev,
          [file.uri]: {
            uri: file.uri,
            isPlaying: true,
            progress: 0,
            sound: sound
          }
        }));
      } else if (currentState.sound) {
        // Toggle play/pause if already loaded
        if (currentState.isPlaying) {
          await currentState.sound.pauseAsync();
        } else {
          await currentState.sound.playAsync();
        }
      }
    } catch (error) {
      console.error('Error handling audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (uri: string) => (status: any) => {
    if (status.isLoaded) {
      setAudioStates(prev => ({
        ...prev,
        [uri]: {
          ...prev[uri],
          isPlaying: status.isPlaying,
          progress: status.positionMillis / (status.durationMillis || 1)
        }
      }));
    }
  };

  const handleAudioSeek = async (uri: string, position: number) => {
    const currentState = audioStates[uri];
    if (currentState?.sound) {
      try {
        const status = await currentState.sound.getStatusAsync();
        if (status.isLoaded) {
          const seekPosition = position * status.durationMillis;
          await currentState.sound.setPositionAsync(seekPosition);
        }
      } catch (error) {
        console.error('Error seeking audio:', error);
      }
    }
  };

  // Cleanup function for audio
  const cleanupAudio = async (uri: string) => {
    const state = audioStates[uri];
    if (state?.sound) {
      await state.sound.unloadAsync();
      setAudioStates(prev => {
        const newStates = { ...prev };
        delete newStates[uri];
        return newStates;
      });
    }
  };

  // Modified file handling functions
  const handleRemoveFile = async (file: UploadedFile) => {
    try {
      await removeFile(file);
      if (file.type.startsWith('audio/')) {
        await cleanupAudio(file.uri);
      }
      setSelectedFiles(prev => prev.filter(f => f.uri !== file.uri));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const renderCategoryPicker = () => (
    <View className="px-4 py-3">
      <Text className="text-white mb-2">Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(['artwork', 'music', 'photography', 'design', 'other'] as PostCategory[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            className={`mr-2 px-4 py-2 rounded-full ${
              category === cat ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white capitalize">{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      Object.keys(audioStates).forEach(uri => {
        cleanupAudio(uri);
      });
    };
  }, []);

  // Modified renderMediaPreview
  const renderMediaPreview = (file: UploadedFile) => {
    // Common remove button component
    const RemoveButton = () => (
      <TouchableOpacity
        className="absolute -top-2 -right-2 bg-black rounded-full p-1"
        onPress={() => handleRemoveFile(file)}
      >
        <Text className="text-white text-xs px-2">×</Text>
      </TouchableOpacity>
    );

    if (file.type.startsWith('audio/')) {
      const audioState = audioStates[file.uri] || {
        isPlaying: false,
        progress: 0
      };

      return (
        <View key={file.uri} className="relative bg-gray-800 p-4 rounded-lg mr-2 w-full">
          <Text className="text-white text-sm mb-2">{file.name}</Text>
          <AudioWaveform
            isPlaying={audioState.isPlaying}
            progress={audioState.progress}
            onPlayPause={() => handleAudioToggle(file)}
            onSeek={(position) => handleAudioSeek(file.uri, position)}
            height={30}
            barCount={80}
            playedColor="#fff"
            unplayedColor="#A5A6AA"
          />
          <RemoveButton />
        </View>
      );
    }

    // Rest of the existing renderMediaPreview code...
    if (file.type === 'image/gif' || file.uri.endsWith('.gif')) {
      return (
        <View key={file.uri} className="relative w-24 h-24 mr-2">
          <Image
            source={{ uri: file.uri }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded">
            <Text className="text-white text-xs">GIF</Text>
          </View>
          <RemoveButton />
        </View>
      );
    } else if (file.type.startsWith('image/')) {
      return (
        <View key={file.uri} className="relative w-24 h-24 mr-2">
          <Image
            source={{ uri: file.uri }}
            className="w-full h-full rounded-lg"
          />
          <RemoveButton />
        </View>
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <View key={file.uri} className="relative w-24 h-24 mr-2">
          <Video
            ref={videoRef}
            source={{ uri: file.uri }}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
            resizeMode="cover"
            isLooping
            isMuted
          />
          <RemoveButton />
        </View>
      );
    }
    return null;
  };

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
      setPostText('');
      setSelectedFiles([]);
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#040405', width: 40 }}
      backgroundStyle={{ backgroundColor: '#040405' }}
      onChange={handleSheetChanges}
    >
      <BottomSheetView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-400 text-[16px]">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white text-[18px] font-semibold">Create post</Text>
          <TouchableOpacity onPress={handleCreatePost}>
            <Text className="text-gray-600 text-[16px]">Post</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View className="flex-row items-center px-4 py-3">
          <Image
            source={{ uri: "https://example.com/placeholder.jpg" }}
            className="w-10 h-10 rounded-full bg-gray-700"
          />
          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="text-white text-[16px] font-semibold">
                {community?.name || "Rema"}
              </Text>
              <View className="bg-[#00BA88] w-4 h-4 rounded-full ml-2 items-center justify-center">
                <Text className="text-white text-[10px]">✓</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Text Input Area */}
          <View className="px-4 py-3">
            <TextInput
              multiline
              numberOfLines={4}
              maxLength={150}
              placeholder="What's on your mind?"
              placeholderTextColor="#787A80"
              value={postText}
              onChangeText={setPostText}
              className="text-white text-[16px] h-[120px]"
            />
          </View>
          {/* Media Preview */}
          {selectedFiles.length > 0 && (
            <ScrollView
              horizontal
              className="px-4 mb-3"
              showsHorizontalScrollIndicator={false}
            >
              {selectedFiles.map(renderMediaPreview)}
            </ScrollView>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-4 pb-8 space-y-4 absolute bottom-[120px] right-0 left-0">
          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.IMAGE)}
            disabled={isLoading}
          >
            <Image02Icon size={24} color="#787A80" />
            <Text className="text-gray-400 ml-3">Add a photo/video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.GIF)}
            disabled={isLoading}
          >
            <Gif01Icon size={24} color="#787A80" />
            <Text className="text-gray-400 ml-3">Add a GIF file</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.AUDIO)}
            disabled={isLoading}
          >
            <VoiceIcon size={24} color="#787A80" />
            <Text className="text-gray-400 ml-3">Add audio file</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 border-t border-gray-800">
            <Calendar01Icon size={24} color="#FF5733" />
            <Text className="text-[#FF5733] ml-3">Create an event</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CreatePostModal;
