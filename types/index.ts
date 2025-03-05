export type ClaimStatus = "NOT_SUBMITTED" | "pending" | "approved" | "rejected";
// First, let's create a type definition for the allowed file types
export type CollectibleFileType = 'PNG' | 'JPG' | 'WEBP' | 'GIF';

// Helper function to normalize file type
export const normalizeFileType = (type: string): CollectibleFileType => {
  const normalized = type.toUpperCase();
  switch (normalized) {
    case 'PNG':
    case 'JPG':
    case 'WEBP':
    case 'GIF':
      return normalized as CollectibleFileType;
    default:
      throw new Error('Unsupported file type');
  }
};

// Function to extract file type from file name or MIME type
export const getFileTypeFromUri = (uri: string): CollectibleFileType => {
  const extension = uri.split('.').pop()?.toLowerCase() || '';
  return normalizeFileType(extension);
};

export interface CreatorFormData {
  stageName: string;
  
  bio: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  websiteUrl: string;
  socialAccounts: {
    twitter: string;
    instagram: string;
    tiktok: string;
  };
  profileImage?: string;
}

export interface Artist {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    biography: string;
    address1: string;
    address2: string;
    country: string;
    postalcode: string;
    city: string;
    websiteurl: string;
    monthlyListeners: number;
    followers: number;
    verified: boolean;
    popularity: number;
    roles: string[];
    labels: string[];
    isActive: boolean;
    topTracks: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    releases: string[];
  }

  export interface ArtistResponse {
    message: string;
    data: Artist;
  }
