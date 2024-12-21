import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="(home)"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="add"
          options={{ title: "Add Post", presentation: "modal" }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
