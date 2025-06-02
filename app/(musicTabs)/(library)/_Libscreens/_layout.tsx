import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack screenOptions={{
     headerShown: false,
     contentStyle: {
        backgroundColor: "#000000",
      },
      headerStyle: {
        backgroundColor: "#040405",
      },
      }}>
      <Stack.Screen name='PlaylistDetails' />
    </Stack>
  );
}
