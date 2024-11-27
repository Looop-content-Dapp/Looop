import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert, Linking, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { GiphyDialog, GiphyDialogEvent, GiphyMedia, GiphySDK } from '@giphy/react-native-sdk';
import { GiphyGridViewMediaSelectEvent } from '@giphy/react-native-sdk/lib/typescript/GiphyGridView';

// File type enums
export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif'
}

// Mime type mappings
export const MimeTypes = {
  [FileType.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/ogg'] as const,
  [FileType.IMAGE]: ['image/jpeg', 'image/png', 'image/webp'] as const,
  [FileType.VIDEO]: ['video/mp4', 'video/quicktime'] as const,
  [FileType.GIF]: ['image/gif'] as const,
} as const;

// Type for supported mime types
export type SupportedMimeType = typeof MimeTypes[keyof typeof MimeTypes][number];

// Interface for file constraints
interface FileConstraints {
  mimeTypes: readonly string[];
  maxSize: number;
}

// Interface for file constraints configuration
interface FileConstraintsConfig {
  [FileType.AUDIO]: FileConstraints;
  [FileType.IMAGE]: FileConstraints;
  [FileType.VIDEO]: FileConstraints;
  [FileType.GIF]: FileConstraints;
}

// Interface for uploaded file
export interface UploadedFile {
  uri: string;
  name: string;
  type: SupportedMimeType;
  size: number;
}

// Interface for upload result
export interface UploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

// Interface for hook return type
export interface UseFileUploadReturn {
  files: UploadedFile[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  pickFile: (type?: FileType) => Promise<UploadResult | null>;
  removeFile: (file: UploadedFile) => Promise<void>;
  clearCache: () => Promise<void>;
}

const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // File constraints
  const fileConstraints: FileConstraintsConfig = {
    [FileType.AUDIO]: {
      mimeTypes: MimeTypes[FileType.AUDIO],
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    [FileType.IMAGE]: {
      mimeTypes: MimeTypes[FileType.IMAGE],
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    [FileType.VIDEO]: {
      mimeTypes: MimeTypes[FileType.VIDEO],
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    [FileType.GIF]: {
      mimeTypes: MimeTypes[FileType.GIF],
      maxSize: 15 * 1024 * 1024, // 15MB
    },
  };

  const validateFile = async (
    fileUri: string,
    fileType: FileType,
    mimeType: string
  ): Promise<boolean> => {
    const constraints = fileConstraints[fileType];

    if (!constraints) {
      throw new Error('Unsupported file type');
    }

    if (!constraints.mimeTypes.includes(mimeType as SupportedMimeType)) {
      throw new Error(
        `Invalid ${fileType} format. Supported formats: ${constraints.mimeTypes.join(', ')}`
      );
    }

    // Check file size using Expo FileSystem
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.size > constraints.maxSize) {
      throw new Error(
        `File size exceeds ${constraints.maxSize / (1024 * 1024)}MB limit`
      );
    }

    return true;
  };

  const requestMediaLibraryPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return true;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'This app needs access to your photo library to upload media. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error requesting permissions:', err);
      return false;
    }
  };

  const pickImageOrVideo = async (type: FileType): Promise<UploadResult | null> => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Media library access denied');
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: type === FileType.IMAGE
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      const mimeType = asset.mimeType ||
        (type === FileType.IMAGE ? 'image/jpeg' : 'video/mp4');

      await validateFile(asset.uri, type, mimeType);

      const filename = asset.uri.split('/').pop() || `${type}-${Date.now()}`;

      const newFile: UploadedFile = {
        uri: asset.uri,
        name: filename,
        type: mimeType as SupportedMimeType,
        size: asset.fileSize || 0,
      };

      setFiles(prevFiles => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const pickAudio = async (): Promise<UploadResult | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: MimeTypes[FileType.AUDIO],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      const file = result.assets[0];
      await validateFile(file.uri, FileType.AUDIO, file.mimeType || 'audio/mpeg');

      const newFile: UploadedFile = {
        uri: file.uri,
        name: file.name || `audio-${Date.now()}`,
        type: file.mimeType as SupportedMimeType,
        size: file.size || 0,
      };

      setFiles(prevFiles => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const pickGif = async (): Promise<UploadResult | null> => {
    try {
      // Configure the dialog settings
      GiphyDialog.configure({
        mediaTypeConfig: ['gif'],  // Changed from 'gif' to 'gifs'
        theme: 'dark',
        showConfirmationScreen: true,
        stickerColumnCount: 3,
        showCheckeredBackground: false,
      });

      return new Promise((resolve) => {
        const cleanup = () => {
            GiphyDialog.removeAllListeners('didSelect');
            GiphyDialog.removeAllListeners('didDismiss');
          };

          const handleMediaSelect = async (e: GiphyGridViewMediaSelectEvent) => {
            try {
              if (e.media) {
                const result = await handleGifSelection(e.media);
                cleanup();
                resolve(result);
              } else {
                cleanup();
                resolve(null);
              }
            } catch (error) {
              cleanup();
              resolve({
                success: false,
                error: 'Failed to process selected GIF'
              });
            }
          };

          const handleDismiss = () => {
            cleanup();
            resolve(null);
          };

        // Add event listeners using the correct event names
        GiphyDialog.addListener('onMediaSelect', handleMediaSelect);
        GiphyDialog.addListener('onDismiss', handleDismiss);

        // Show the dialog
        GiphyDialog.show();
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const handleGifSelection = async (media: GiphyMedia): Promise<UploadResult> => {
    try {
      // Get the GIF URL from the media object - use original format for best quality
      const gifUrl = media.url;

      // Download the GIF to local cache
      const filename = `gif-${Date.now()}.gif`;
      const localUri = `${FileSystem.cacheDirectory}${filename}`;

      // Download GIF
      const downloadResult = await FileSystem.downloadAsync(
        gifUrl,
        localUri
      );

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      // Validate file
      await validateFile(localUri, FileType.GIF, 'image/gif');

      const newFile: UploadedFile = {
        uri: localUri,
        name: filename,
        type: 'image/gif' as SupportedMimeType,
        size: fileInfo.size || 0,
      };

      setFiles(prevFiles => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const pickFile = useCallback(async (
    type: FileType = FileType.IMAGE
  ): Promise<UploadResult | null> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      let result;

      switch (type) {
        case FileType.AUDIO:
          result = await pickAudio();
          break;
        case FileType.GIF:
          result = await pickGif();
          break;
        default:
          result = await pickImageOrVideo(type);
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      setProgress(100);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFile = useCallback(async (fileToRemove: UploadedFile): Promise<void> => {
    try {
      // If the file is in cache, remove it
      if (fileToRemove.uri.startsWith(FileSystem.cacheDirectory as string)) {
        await FileSystem.deleteAsync(fileToRemove.uri);
      }
      setFiles(prevFiles => prevFiles.filter(file => file.uri !== fileToRemove.uri));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error removing file: ${errorMessage}`);
    }
  }, []);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'DocumentPicker', {
        idempotent: true
      });
      // Also clear GIF cache
      const gifCacheDir = `${FileSystem.cacheDirectory}gifs/`;
      await FileSystem.deleteAsync(gifCacheDir, { idempotent: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error clearing cache: ${errorMessage}`);
    }
  }, []);

  return {
    files,
    isLoading,
    error,
    progress,
    pickFile,
    removeFile,
    clearCache
  };
};

export default useFileUpload;
