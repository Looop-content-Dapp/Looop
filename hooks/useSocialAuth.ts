import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';

interface SocialAuthResponse {
  profileUrl: string;
  error?: string;
}

WebBrowser.maybeCompleteAuthSession();

export const useSocialAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Twitter Auth Request
  const [_twitterRequest, _twitterResponse, promptTwitterAsync] = useAuthRequest(
    {
      clientId: 'ZnhqNTBjSkhQSmNKNE5fRkhkVE86MTpjaQ',
      redirectUri: makeRedirectUri({ scheme: 'looop' }),
      responseType: ResponseType.Code,
      scopes: ['tweet.read', 'users.read'],
    },
    {
      authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    }
  );

  // Instagram Auth Request
  const [_instaRequest, _instaResponse, promptInstagramAsync] = useAuthRequest(
    {
      clientId: 'awhcx8klcdnek7qi',
      redirectUri: makeRedirectUri({ scheme: 'looop' }),
      responseType: ResponseType.Code,
      scopes: ['user_profile'],
    },
    {
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    }
  );

  // TikTok Auth Request
  const [_tiktokRequest, _tiktokResponse, promptTiktokAsync] = useAuthRequest(
    {
      clientId: '7448188012342641669',
      redirectUri: makeRedirectUri({ scheme: 'looop' }),
      responseType: ResponseType.Code,
      scopes: ['user.info.basic'],
    },
    {
      authorizationEndpoint: 'https://www.tiktok.com/auth/authorize',
    }
  );

  const connectTwitter = useCallback(async (): Promise<SocialAuthResponse> => {
    setIsAuthenticating(true);
    try {
      const result = await promptTwitterAsync();
      if (result.type === 'success') {
        const username = result.params.screen_name || 'user';
        return { profileUrl: `https://twitter.com/${username}` };
      }
      return { profileUrl: '', error: 'Authentication cancelled' };
    } catch (error) {
      return { profileUrl: '', error: 'Failed to connect Twitter account' };
    } finally {
      setIsAuthenticating(false);
    }
  }, [promptTwitterAsync]);

  const connectInstagram = useCallback(async (): Promise<SocialAuthResponse> => {
    setIsAuthenticating(true);
    try {
      const result = await promptInstagramAsync();
      if (result.type === 'success') {
        const username = result.params.username || 'user';
        return { profileUrl: `https://instagram.com/${username}` };
      }
      return { profileUrl: '', error: 'Authentication cancelled' };
    } catch (error) {
      return { profileUrl: '', error: 'Failed to connect Instagram account' };
    } finally {
      setIsAuthenticating(false);
    }
  }, [promptInstagramAsync]);

  const connectTikTok = useCallback(async (): Promise<SocialAuthResponse> => {
    setIsAuthenticating(true);
    try {
      const result = await promptTiktokAsync();
      if (result.type === 'success') {
        const username = result.params.username || 'user';
        return { profileUrl: `https://tiktok.com/@${username}` };
      }
      return { profileUrl: '', error: 'Authentication cancelled' };
    } catch (error) {
      return { profileUrl: '', error: 'Failed to connect TikTok account' };
    } finally {
      setIsAuthenticating(false);
    }
  }, [promptTiktokAsync]);

  return {
    connectTwitter,
    connectInstagram,
    connectTikTok,
    isAuthenticating
  };
};