import { AuthProvider, UserRole, AdminLevel } from './prismaTypes'; // Assuming these enums are defined elsewhere

export interface Wallets {
 wallet: {
    address: string;
    publickKey: string;
 }
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  image?: string | null;
  username?: string | null;
  bio?: string | null;
  isVerified: boolean;
  lastLoginAt?: Date | null;
  lastUsernameChangeAt?: Date | null;
  DateOfBirth?: Date | null;
  country?: string | null;
  authProvider?: AuthProvider | null;
  role: UserRole;
  permissions: string[];
  isAdmin: boolean;
  adminLevel?: AdminLevel | null;
  adminApprovedAt?: Date | null;
  adminApprovedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations would be arrays or objects as per Prisma, but for TS interface, define as needed
  [key: string]: any;
}

export interface AuthState {
  userdata: UserData | null;
  authToken: string | null;
  claimId: string | null;
  artistId: string | null;
  channel: string | null;
  preferences?: {
    favoriteGenres: string[];
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS' | 'KES' | 'ZAR';
    chain: 'XION' | 'STARKNET';
    theme: 'light' | 'dark' | 'system';
    displayMode: 'compact' | 'comfortable';
  };
  settingdone: boolean;
}

export interface AuthActions {
  setUserData: (userdata: UserData | null) => void;
  setToken: (authToken: string | null) => void;
  setClaimId: (claimId: string | null) => void;
  setArtistId: (artistId: string | null) => void;
  setChannel: (channel: string | null) => void;
  setSettingDone: (settingdone: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;
