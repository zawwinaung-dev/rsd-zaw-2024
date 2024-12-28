import { ThemeSwitchButton } from "@/components/ThemeSwitchButton";
import { View, Text } from "react-native";

export default function Settings() {
    return <View style={{ flex:1 , justifyContent: "center", alignItems: "center"}}>
        <ThemeSwitchButton />
    </View>
}