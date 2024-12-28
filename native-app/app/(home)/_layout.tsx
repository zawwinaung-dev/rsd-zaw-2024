import { Tabs, router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { TouchableOpacity, Button } from "react-native"
import { useTheme } from "@react-navigation/native"

export default function Home() {
    const { colors } = useTheme();
    return ( 
        <Tabs screenOptions={{ tabBarActiveTintColor: "#F72C58"}}>
            <Tabs.Screen 
                name="index"
                options={{
                    headerRight: () => (
                        <TouchableOpacity 
                            style={{ marginRight: 10}}
                            onPress={() => {
                                router.push("/add");
                            }}>
                            <Ionicons name="add" size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="home-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({color}) => (
                        <Ionicons
                            name="person-circle-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({color}) => (
                        <Ionicons
                            name="search-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({color}) => (
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}