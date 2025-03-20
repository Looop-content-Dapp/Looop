declare module 'react-native-dominant-color' {
  export function getDominantColor(imageUrl: string): Promise<string>;
  export function getColors(imageUrl: string): Promise<{
    dominant: string;
    average: string;
    vibrant: string;
    darkVibrant: string;
    lightVibrant: string;
    muted: string;
    darkMuted: string;
    lightMuted: string;
  }>;
}
