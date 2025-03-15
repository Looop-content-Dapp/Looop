import { Stack } from "expo-router";

export default function SettingUpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: "#0A0B0F" },
        animation: "slide_from_right",
        headerStyle: {
            backgroundColor: "#040405",
          },
          title: "",
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="musicSetup"
        options={{
          headerShown: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="communityOnboarding"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="listenTo"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
        <Stack.Screen
        name="permissions"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
