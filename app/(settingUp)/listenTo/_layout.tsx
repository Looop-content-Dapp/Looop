import { Stack } from "expo-router";

export default function ListenTo() {
  return (
    <Stack
        screenOptions={{
            headerShown: true,
            contentStyle: { backgroundColor: "#0A0B0F" },
            headerStyle: { backgroundColor: "#0A0B0F" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            headerShadowVisible: false,
            

        }}
        
    />
    );
}