import { useState, useCallback, Dispatch, SetStateAction } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Alert, Linking, Platform } from "react-native";
import {
  GiphyDialog,
  GiphyMedia,
} from "@giphy/react-native-sdk";
import { GiphyGridViewMediaSelectEvent } from "@giphy/react-native-sdk/lib/typescript/GiphyGridView";

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  bytes: number;
  error?: {
    message: string;
  };
}

const CLOUDINARY_CONFIG = {
  uploadPreset: 'Looop_preset', // TODO: Please @joeephwild replace wwith Looop upload preset
  cloudName: process.env.EXPO_CLOUD_NAME || 'dx8jul61w', // TODO: Please @joeephwild replace wwith Looop cloud name
  apiBaseUrl: "https://api.cloudinary.com/v1_1"
} as const;

// File type enums
export enum FileType {
  AUDIO = "audio",
  IMAGE = "image",
  VIDEO = "video",
  GIF = "gif"
}

// Mime type mappings
export const MimeTypes = {
  [FileType.AUDIO]: ["audio/mpeg", "audio/wav", "audio/ogg"] as const,
  [FileType.IMAGE]: ["image/jpeg", "image/png", "image/webp"] as const,
  [FileType.VIDEO]: ["video/mp4", "video/quicktime"] as const,
  [FileType.GIF]: ["image/gif"] as const
} as const;

// Type for supported mime types
export type SupportedMimeType =
  (typeof MimeTypes)[keyof typeof MimeTypes][number];

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
  setError: Dispatch<SetStateAction<string | null>>;
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
      maxSize: 50 * 1024 * 1024 // 50MB
    },
    [FileType.IMAGE]: {
      mimeTypes: MimeTypes[FileType.IMAGE],
      maxSize: 50 * 1024 * 1024 // 50MB
    },
    [FileType.VIDEO]: {
      mimeTypes: MimeTypes[FileType.VIDEO],
      maxSize: 100 * 1024 * 1024 // 100MB
    },
    [FileType.GIF]: {
      mimeTypes: MimeTypes[FileType.GIF],
      maxSize: 15 * 1024 * 1024 // 15MB
    }
  };

  const validateFile = async (
    fileUri: string,
    fileType: FileType,
    mimeType: string
  ): Promise<boolean> => {
    const constraints = fileConstraints[fileType];

    if (!constraints) {
      throw new Error("Unsupported file type");
    }

    if (!constraints.mimeTypes.includes(mimeType as SupportedMimeType)) {
      throw new Error(
        `Invalid ${fileType} format. Supported formats: ${constraints.mimeTypes.join(
          ", "
        )}`
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
    if (Platform.OS !== "ios" && Platform.OS !== "android") return true;

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "This app needs access to your photo library to upload media. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error requesting permissions:", err);
      return false;
    }
  };

  const pickImageOrVideo = async (
    type: FileType
  ): Promise<UploadResult | null> => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error("Media library access denied");
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes:
          type === FileType.IMAGE
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];

      const mimeType =
        asset.mimeType ||
        (type === FileType.IMAGE ? "image/jpeg" : "video/mp4");

      await validateFile(asset.uri, type, mimeType);

      const filename = asset.uri.split("/").pop() || `${type}-${Date.now()}`;

      const newFile: UploadedFile = {
        uri: asset.uri,
        name: filename,
        type: mimeType as SupportedMimeType,
        size: asset.fileSize || 0
      };

      setFiles((prevFiles) => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
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
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return null;
      }

      const file = result.assets[0];
      await validateFile(
        file.uri,
        FileType.AUDIO,
        file.mimeType || "audio/mpeg"
      );

      const newFile: UploadedFile = {
        uri: file.uri,
        name: file.name || `audio-${Date.now()}`,
        type: file.mimeType as SupportedMimeType,
        size: file.size || 0
      };

      setFiles((prevFiles) => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
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
        mediaTypeConfig: ["gif"], // Changed from 'gif' to 'gifs'
        theme: "dark",
        showConfirmationScreen: true,
        stickerColumnCount: 3,
        showCheckeredBackground: false
      });

      return new Promise((resolve) => {
        const cleanup = () => {
          GiphyDialog.removeAllListeners("didSelect");
          GiphyDialog.removeAllListeners("didDismiss");
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
              error: "Failed to process selected GIF"
            });
          }
        };

        const handleDismiss = () => {
          cleanup();
          resolve(null);
        };

        // Add event listeners using the correct event names
        GiphyDialog.addListener("onMediaSelect", handleMediaSelect);
        GiphyDialog.addListener("onDismiss", handleDismiss);

        // Show the dialog
        GiphyDialog.show();
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const handleGifSelection = async (
    media: GiphyMedia
  ): Promise<UploadResult> => {
    try {
      // Get the GIF URL from the media object - use original format for best quality
      const gifUrl = media.url;

      // Download the GIF to local cache
      const filename = `gif-${Date.now()}.gif`;
      const localUri = `${FileSystem.cacheDirectory}${filename}`;

      // Download GIF
      const downloadResult = await FileSystem.downloadAsync(gifUrl, localUri);

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      // Validate file
      await validateFile(localUri, FileType.GIF, "image/gif");

      const newFile: UploadedFile = {
        uri: localUri,
        name: filename,
        type: "image/gif" as SupportedMimeType,
        size: fileInfo.size || 0
      };

      setFiles((prevFiles) => [...prevFiles, newFile]);

      return {
        success: true,
        file: newFile
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const pickFile = useCallback(
    async (type: FileType = FileType.IMAGE): Promise<UploadResult | null> => {
      setError(null);
      setProgress(0);
      setIsLoading(true);

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

        if (!result?.file) {
          return null;
        }

        // Upload to Cloudinary
        const uploadedFile = await uploadToCloudinary(
          result.file,
          result.file.uri,
          type
        );

        setFiles((prevFiles) => [...prevFiles, uploadedFile]);

        return {
          success: true,
          file: uploadedFile
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeFile = useCallback(
    async (fileToRemove: UploadedFile): Promise<void> => {
      try {
        // If the file is in cache, remove it
        if (fileToRemove.uri.startsWith(FileSystem.cacheDirectory as string)) {
          await FileSystem.deleteAsync(fileToRemove.uri);
        }
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.uri !== fileToRemove.uri)
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Error removing file: ${errorMessage}`);
      }
    },
    []
  );

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await FileSystem.deleteAsync(
        FileSystem.cacheDirectory + "DocumentPicker",
        {
          idempotent: true
        }
      );
      // Also clear GIF cache
      const gifCacheDir = `${FileSystem.cacheDirectory}gifs/`;
      await FileSystem.deleteAsync(gifCacheDir, { idempotent: true });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Error clearing cache: ${errorMessage}`);
    }
  }, []);

  const uploadToCloudinary = async (
    file: UploadedFile,
    fileUri: string,
    fileType: FileType
  ): Promise<UploadedFile> => {
    try {
      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create form data
      const formData = new FormData();

      // Append file as blob with correct mime type
      const blob = {
        uri: fileUri,
        type: file.type,
        name: file.name,
      };
      formData.append('file', blob as any);

      // Add upload preset and cloud name
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

      // Set resource type based on file type
      const resourceType = fileType === FileType.VIDEO ? 'video' :
                          fileType === FileType.AUDIO ? 'raw' : 'image';

      // Make upload request with correct resource type
      const response = await fetch(
        `${CLOUDINARY_CONFIG.apiBaseUrl}/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json() as CloudinaryResponse;

      return {
        uri: result.secure_url,
        name: result.public_id,
        type: file.type as SupportedMimeType,
        size: result.bytes
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(
        error instanceof Error
          ? `Cloudinary upload failed: ${error.message}`
          : 'Cloudinary upload failed: Unknown error'
      );
    }
  };


  return {
    files,
    isLoading,
    error,
    setError,
    progress,
    pickFile,
    removeFile,
    clearCache
  };
};

export default useFileUpload;
