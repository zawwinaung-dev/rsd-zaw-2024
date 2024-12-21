import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(home)"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen 
        name="add"
        options={{ title: "Add Post", presentation: "modal"}}
      />
    </Stack>
  );
}