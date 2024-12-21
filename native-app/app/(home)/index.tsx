import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  author: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    fontSize: 18,
    lineHeight: 27,
  }
})

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.author}>
            <Ionicons 
              name="person-circle"
              size={32}
              color="#F72C5B"
            />
            <Text style={styles.authorName}>Alice</Text>
          </View>
          <TouchableOpacity>
            <Ionicons 
              name="trash"
              color="gray"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.content}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores magnam perspiciatis architecto. Reprehenderit blanditiis necessitatibus sequi repudiandae delectus nulla assumenda qui, mollitia nihil aliquam eveniet, inventore recusandae minus omnis impedit!
            </Text>
        </View>
      </View>
    </ScrollView>
  );
}
