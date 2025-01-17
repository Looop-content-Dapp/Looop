// useCloudinaryUpload.ts

import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert, Linking, Platform } from 'react-native';
import { GiphyDialog, GiphyMedia } from '@giphy/react-native-sdk';
import { GiphyGridViewMediaSelectEvent } from '@giphy/react-native-sdk/lib/typescript/GiphyGridView';
import axios from 'axios';

// File type enums
export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  GIF = 'gif'
}

// Resource types for Cloudinary
export enum ResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  RAW = 'raw',
  AUTO = 'auto'
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

// Interface for Cloudinary configuration
export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}

// Interface for Cloudinary response
export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: ResourceType;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  duration?: number;
}

// Interface for uploaded file
export interface UploadedFile {
  uri: string;
  name: string;
  type: SupportedMimeType;
  size: number;
  cloudinary?: CloudinaryResponse;
}

// Interface for upload result
export interface UploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

// Interface for hook return type
export interface UseCloudinaryUploadReturn {
  files: UploadedFile[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  pickFile: (type?: FileType) => Promise<UploadResult | null>;
  removeFile: (file: UploadedFile) => Promise<void>;
  clearCache: () => Promise<void>;
}

export const useFileUpload = (config: CloudinaryConfig): UseCloudinaryUploadReturn => {
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

  // Function to get Cloudinary signature
  const getCloudinarySignature = async (paramsToSign: Record<string, any>): Promise<string> => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const params = {
      timestamp,
      ...paramsToSign
    };

    // Normally this would be done on your backend
    // This is just for demonstration - in production, generate signature on server
    const signatureString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&') + config.apiSecret;

    // You would typically make an API call to your backend here
    return signatureString;
  };

  // Function to determine resource type based on file type
  const getResourceType = (fileType: FileType): ResourceType => {
    switch (fileType) {
      case FileType.IMAGE:
      case FileType.GIF:
        return ResourceType.IMAGE;
      case FileType.VIDEO:
        return ResourceType.VIDEO;
      case FileType.AUDIO:
        return ResourceType.RAW;
      default:
        return ResourceType.AUTO;
    }
  };

  // Function to upload file to Cloudinary
  const uploadToCloudinary = async (
    fileUri: string,
    fileType: FileType,
    filename: string
  ) => {
    const resourceType = getResourceType(fileType);
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const uploadParams = {
      timestamp,
      upload_preset: config.uploadPreset,
      folder: config.folder
    };

    // const signature = await getCloudinarySignature(uploadParams);
    const apiUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/${fileType}/upload`;

    // const formData = new FormData();
    // formData.append('file', {
    //   uri: fileUri,
    //   type: 'application/octet-stream',
    //   name: filename
    // } as any);
    // formData.append('api_key', config.apiKey);
    // formData.append('timestamp', timestamp.toString());
    // formData.append('signature', signature);

    // Object.entries(uploadParams).forEach(([key, value]) => {
    //   if (value) formData.append(key, value);
    // });

    try {
      const response = await axios.post(apiUrl, {
         file: fileUri,
         api_key: process.env.EXPO_API_KEY,
         timestamp: timestamp
      });

      if (!response) {
        throw new Error(`Upload failed:`);
      }

    //   const data = await response;
    console.log(response)
      return response.data
    } catch (err) {
      throw new Error(`Cloudinary upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
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

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(asset.uri, type, filename);

      const newFile: UploadedFile = {
        uri: asset.uri,
        name: filename,
        type: mimeType as SupportedMimeType,
        size: asset.fileSize || 0,
        cloudinary: cloudinaryResponse
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

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(
        file.uri,
        FileType.AUDIO,
        file.name || `audio-${Date.now()}`
      );

      const newFile: UploadedFile = {
        uri: file.uri,
        name: file.name || `audio-${Date.now()}`,
        type: file.mimeType as SupportedMimeType,
        size: file.size || 0,
        cloudinary: cloudinaryResponse
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
      GiphyDialog.configure({
        mediaTypeConfig: ['gif'],
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

        GiphyDialog.addListener('onMediaSelect', handleMediaSelect);
        GiphyDialog.addListener('onDismiss', handleDismiss);

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
      const gifUrl = media.url;
      const filename = `gif-${Date.now()}.gif`;
      const localUri = `${FileSystem.cacheDirectory}${filename}`;

      const downloadResult = await FileSystem.downloadAsync(
        gifUrl,
        localUri
      );

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      await validateFile(localUri, FileType.GIF, 'image/gif');

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(localUri, FileType.GIF, filename);

      const newFile: UploadedFile = {
        uri: localUri,
        name: filename,
        type: 'image/gif' as SupportedMimeType,
        size: fileInfo.size || 0,
        cloudinary: cloudinaryResponse
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
            setProgress(10);
            result = await pickAudio();
            break;
          case FileType.GIF:
            setProgress(10);
            result = await pickGif();
            break;
          default:
            setProgress(10);
            result = await pickImageOrVideo(type);
        }

        if (!result?.success || !result.file) {
          return result;
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
        // Remove from Cloudinary if uploaded
        if (fileToRemove.cloudinary?.public_id) {
          const resourceType = fileToRemove.cloudinary.resource_type;
          const timestamp = Math.round((new Date()).getTime() / 1000);

          const deleteParams = {
            public_id: fileToRemove.cloudinary.public_id,
            resource_type: resourceType,
            timestamp,
            api_key: config.apiKey
          };

          const signature = await getCloudinarySignature(deleteParams);
          const deleteUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/destroy`;

          const formData = new FormData();
          Object.entries(deleteParams).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append('signature', signature);

          await fetch(deleteUrl, {
            method: 'POST',
            body: formData,
          });
        }

        // Remove local file if it exists in cache
        if (fileToRemove.uri.startsWith(FileSystem.cacheDirectory as string)) {
          await FileSystem.deleteAsync(fileToRemove.uri, { idempotent: true });
        }

        // Remove from state
        setFiles(prevFiles => prevFiles.filter(file => file.uri !== fileToRemove.uri));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Error removing file: ${errorMessage}`);
      }
    }, [config]);

    const clearCache = useCallback(async (): Promise<void> => {
      try {
        // Clear document picker cache
        await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'DocumentPicker', {
          idempotent: true
        });

        // Clear GIF cache
        const gifCacheDir = `${FileSystem.cacheDirectory}gifs/`;
        await FileSystem.deleteAsync(gifCacheDir, { idempotent: true });

        // Clear uploaded files from state
        setFiles([]);
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
