export type ClaimStatus = "NOT_SUBMITTED" | "pending" | "approved" | "rejected";

export interface CreatorFormData {
  stageName: string;
  email: string;
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
