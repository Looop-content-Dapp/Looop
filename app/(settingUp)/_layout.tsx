import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0A0B0F" },
            headerStyle: { backgroundColor: "#0A0B0F" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            headerShadowVisible: false,
        }}
        />
    );
    }