import { ScrollView, Text, View } from "react-native";
import { useQuery } from "react-query";
import Item from "../../components/Item";
import type { ItemType } from "@/types/ItemType";

async function fetchItems(): Promise<ItemType[]> {
  const res = await fetch("http://172.20.54.194:8080/posts");

  if(!res.ok) {
    throw new Error("Network res was not ok.");
  }

  return res.json();
}

export default function Index() {
  const { data, error, isLoading } = useQuery<ItemType[], Error>("posts", fetchItems);

  if(isLoading) return <Text>Loading...</Text>
  if(error) return <Text>Error: { error.message }</Text>
  if(!data) return <Text>No data</Text>

  return (
    <ScrollView>
      { data.map(item => (
        <Item
          key={item.id}
          item={item}
        />
      ))}
    </ScrollView>
  );
}
