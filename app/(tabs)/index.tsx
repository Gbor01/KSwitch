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
  const init = async () => {
    const data = JSON.parse(await readFile("settings.json"))
    let data_filter = data.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        t.id === obj.id
      ))
    );
    
    if (data.length <= 0) {
      return 0;
    }
    setListData(data_filter)
  }
  useFocusEffect(
    useCallback(() => {
      init()
    }, [])

  )
  /* Köszi ChatGPT megint */
  const handleRemoveButton = async () => {
    await init(); // Újratöltjük az adatokat, ami gyakorlatilag frissíti a képernyőt
  };
  return (
    <SafeAreaView style={{ backgroundColor: color, paddingTop: 20, flex: 1 }}>
      <ThemedView style={{ backgroundColor: color, flexDirection: "row" }}>
        <FlatList
          data={list}
          numColumns={2}
          renderItem={({ item }) => (
            <SwitchButton title={item["title"]} id={item["id"]} type={item["type"]}  repeat={item["shouldRepeat"]} onRemove={handleRemoveButton}></SwitchButton>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

