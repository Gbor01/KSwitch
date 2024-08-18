import { FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SwitchButton } from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readFile } from '@/components/FileManager';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [list, setListData] = useState([]);
  const color = colorScheme === "dark" ? "#151718" : "white"
  const textColor = colorScheme === "dark" ? "white" : "#151718"
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const data = await readFile("settings.json")
        if (data.length <= 0) {
          return 0;
        }
        setListData(JSON.parse(data))
      }
      init()
    }, [])

  )

  return (
    <SafeAreaView style={{ backgroundColor: color, paddingTop: 20, flex: 1 }}>
      <ThemedView style={{ backgroundColor: color, flexDirection: "row" }}>
        <FlatList
          data={list}
          numColumns={2}

          renderItem={({ item }) => (
            <SwitchButton title={item["title"]} id={item["id"]} type={item["type"]} repeat={item["shouldRepeat"]}></SwitchButton>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

