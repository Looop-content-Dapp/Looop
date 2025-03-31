import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from "react-native";
import { Image02Icon, Gif01Icon, VoiceIcon, Calendar01Icon, CheckmarkBadge01Icon} from "@hugeicons/react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Audio, Video } from 'expo-av';
import useFileUpload, { FileType, UploadedFile } from '../../hooks/useFileUpload';
import AudioWaveform from '../animated/AudioWaveForm';
import { Portal } from "@gorhom/portal";
import { useCreatePost } from '@/hooks/useCreatePost';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppSelector } from '@/redux/hooks';

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

  // Update the schema to include selectedFiles
  const postSchema = yup.object({
    content: yup.string()
      .max(150, 'Post content cannot exceed 150 characters')
      .when('selectedFiles', {
        is: (files: UploadedFile[]) => !files?.length,
        then: (schema) => schema.required('Please add some text or media to your post'),
        otherwise: (schema) => schema.optional()
      }),
    category: yup.string().oneOf(['artwork', 'music', 'photography', 'design', 'other']).required(),
    selectedFiles: yup.array().of(yup.mixed()).default([])
  });

  interface UploadedFile {
  uri: string;
  type: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}


  type FormData = yup.InferType<typeof postSchema>;

  // Define the proper types for categories
type PostCategory = 'artwork' | 'music' | 'photography' | 'design' | 'other';
type PostVisibility = 'public' | 'private' | 'community';
type PostStatus = 'draft' | 'published';
type PostType = 'regular' | 'event' | 'announcement';

const CreatePostModal = ({ isVisible, onClose, community, defaultCategory = 'other' }: CreatePostBottomSheetProps) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New audio-related states
  const [audioStates, setAudioStates] = useState<Record<string, AudioState>>({});

  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const videoRef = useRef<Video>(null);

  // Custom hook
  // Add new states for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { userdata } = useAppSelector((auth) => auth.auth)

  // Modified custom hook usage
  const {
    pickFile,
    removeFile,
    isLoading: isFileLoading,
    error: fileError,
    progress,
    clearCache
  } = useFileUpload();
  const { mutate: createPost, isLoading: isCreatingPost } = useCreatePost();

    // Update the form setup
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        resolver: yupResolver(postSchema),
        defaultValues: {
          content: '',
          category: defaultCategory,
        }
      });

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
      ...(file?.width && { width: file.width }),
      ...(file.height && { height: file.height }),
      ...(file?.duration && { duration: file.duration })
    }));
  };

   // Handle post submission
   const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const postData = {
        content: data.content?.trim() || '',
        title: '',
        postType: 'regular' as PostType,
        media: convertFilesToMediaFormat(selectedFiles),
        artistId: userdata?.artist || '',
        communityId: community?._id || '',
        category: data.category as PostCategory,
        visibility: 'public' as PostVisibility,
        status: 'published' as PostStatus,
        type: (selectedFiles.length > 1 ? 'multiple' : 'single') as 'multiple' | 'single',
        tags: [],
        genre: community?.genre || ''
      };
      console.log(postData, "postdata")

      createPost(postData, {
        onSuccess: () => {
          setValue('content', '');
          setSelectedFiles([]);
          clearCache();
          onClose();
          Alert.alert('Success', 'Post created successfully');
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.message || 'Failed to create post. Please try again.'
          );
        }
      });

    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // File handling functions
  const handleFilePick = async (type: FileType) => {
    try {
      setIsUploading(true);
      const result = await pickFile(type);

      if (result?.success && result.file) {
        setSelectedFiles(prev => {
          const newFile = result.file;
          return newFile ? [...prev, newFile] : prev;
        });

        // Update progress
        setUploadProgress(progress);
      } else if (result?.error) {
        Alert.alert('Upload Error', result.error);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert(
        'Error',
        'Failed to upload file. Please try again.'
      );
    } finally {
      setIsUploading(false);
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
            onPress={() => setValue('category', cat)}
            className={`mr-2 px-4 py-2 rounded-full ${
              watch('category') === cat ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white capitalize">{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.category && (
        <Text className="text-red-500 text-sm mt-1">{errors.category.message}</Text>
      )}
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

  const handleEventButtonPress = () => {
    Alert.alert(
      'Coming Soon',
      'Event creation feature will be available soon!'
    );
  };


  const handleClose = useCallback(() => {
    setValue('content', '');
    setValue('category', defaultCategory);
    setSelectedFiles([]);
    clearCache();
    onClose();
  }, [setValue, defaultCategory, clearCache, onClose]);


  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
      handleClose();
    }
  }, [isVisible, setValue, defaultCategory]);

  return (
  <Portal>
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
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-gray-400 text-[16px]">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-[18px] font-semibold">Create post</Text>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isCreatingPost}
            >
              <Text className={`text-[16px] ${
                isSubmitting || isCreatingPost ? 'text-gray-500' : 'text-blue-500'
              }`}>
                {isSubmitting || isCreatingPost ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

        {/* User Info */}
        <View className="flex-row items-center px-4 py-3">
          <Image
            source={{ uri: community?.createdBy?.profileImage }}
            className="w-10 h-10 rounded-full bg-gray-700"
          />
          <View className="ml-3">
            <View className="flex-row items-center">
              <Text className="text-white text-[16px] font-PlusJakartaSansMedium">
                {community?.createdBy?.name || "Rema"}
              </Text>
                <CheckmarkBadge01Icon size={16} variant='solid' color='#2DD881' />
            </View>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Text Input Area */}
          <View className="px-4 py-3">
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    maxLength={150}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#63656B"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    className="text-white text-[20px] min-h-[120px] p-2"
                  />
                  {errors.content && (
                    <Text className="text-red-500 text-sm mt-1">{errors.content.message}</Text>
                  )}
                </>
              )}
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
        <View className="px-4 pb-8 space-y-4 absolute bottom-0 right-0 left-0 bg-[#040405] border-t border-gray-800">
          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.IMAGE)}
            disabled={isFileLoading || isUploading}
          >
            <Image02Icon size={24} color={isFileLoading || isUploading ? "#4B4D52" : "#787A80"} />
            <Text className={`text-[16px] font-PlusJakartaSansMedium ml-3 ${
              isFileLoading || isUploading ? "text-[#4B4D52]" : "text-[#D2D3D5]"
            }`}>
              Add a photo/video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.GIF)}
            disabled={isFileLoading || isUploading}
          >
            <Gif01Icon size={24} color={isFileLoading || isUploading ? "#4B4D52" : "#787A80"} />
            <Text className={`text-[16px] font-PlusJakartaSansMedium ml-3 ${
              isFileLoading || isUploading ? "text-[#4B4D52]" : "text-[#D2D3D5]"
            }`}>
              Add a GIF file
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={() => handleFilePick(FileType.AUDIO)}
            disabled={isFileLoading || isUploading}
          >
            <VoiceIcon size={24} color={isFileLoading || isUploading ? "#4B4D52" : "#787A80"} />
            <Text className={`text-[16px] font-PlusJakartaSansMedium ml-3 ${
              isFileLoading || isUploading ? "text-[#4B4D52]" : "text-[#D2D3D5]"
            }`}>
              Add audio file
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-t border-gray-800"
            onPress={handleEventButtonPress}
          >
            <Calendar01Icon size={24} color="#FF8A49" />
            <Text className="text-[#FF8A49] text-[16px] font-PlusJakartaSansMedium ml-3">
              Create an event (Coming Soon)
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  </Portal>
  );
};

export default CreatePostModal;
