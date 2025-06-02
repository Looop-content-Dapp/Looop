import { ShareContent as RNShareContent } from 'react-native';

export interface ExtendedShareContent extends RNShareContent {
  social?: 'whatsapp' | 'instagram' | 'twitter';
  hashtags?: string;
}

export interface SocialShareOptions {
  title: string;
  message: string;
  url: string;
  social?: 'whatsapp' | 'instagram' | 'twitter';
  hashtags?: string;
}