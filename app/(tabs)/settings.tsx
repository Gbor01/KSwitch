import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
//import { Dropdown } from 'react-native-element-dropdown';
import { Shelly, TOSR } from '@/components/Settings';
import { TextInput } from 'react-native';
import { Pressable } from 'react-native';
import { saveAPI, saveIP,resetFile } from '@/components/FileManager';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#151718" : "white"
  const textColor = colorScheme === "dark" ? "white" : "#151718"
  const [selectedColor, onColorChange] = useState(colorScheme?.toString())
  const [api, onChangeAPI] = useState('');
  const [ip, onChangeIP] = useState('');
  const data = [
    { label: 'Use system', value: undefined },
    { label: 'Dark', value: "dark" },
    { label: 'Light', value: 'light' },


  ];
  const components = {
    "shelly": Shelly,
    "tosr": TOSR
  }
  const styles = StyleSheet.create({
    input: {
      width: "90%",
      alignSelf: "center",
      borderColor: textColor,
      color: textColor,
      height: "auto",
      flexGrow: 1,
      margin: 12,
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,

    },
    button: {
      borderWidth: 2,
      flexGrow: 1,
      borderRadius: 10,
      padding: 10,
      margin: 12,
      alignSelf: "center",
      width: "50%",
      borderColor: textColor,
    },
    text: {
      color: textColor,
      textAlign: "center",
    },
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      alignSelf: "center",
      borderColor: textColor,
      width: "25%",
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: color,
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
      color: textColor,
    },
    placeholderStyle: {
      fontSize: 16,
      color: textColor,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: textColor,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: "auto",
      fontSize: 16,
    },
  });

  /*
  <ThemedText style={{flex:1}}>Style</ThemedText>
          <Dropdown
            style={[styles.dropdown, { borderColor: textColor,flex:1 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select Switch Type'}
            value={selectedColor}
            onChange={item => {
              onColorChange(item.value);
              overrideColorScheme.setScheme(item.value)
            }}
  
          />
          
          */

  return (

    <SafeAreaView style={{ backgroundColor: color, paddingTop: 0, flex: 1 }}>
      <ThemedView style={{ backgroundColor: color, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>


        <TextInput style={styles.input}
          onChangeText={onChangeAPI}
          placeholder="API Key"
          placeholderTextColor={textColor}>

        </TextInput>
        <Pressable style={styles.button}><ThemedText style={styles.text} onPress={() => { saveAPI(api); alert("Restart the app to take effect.") }}>Set API key</ThemedText></Pressable>
        <TextInput style={styles.input}
          onChangeText={onChangeIP}
          placeholder="IP Adress with port"
          placeholderTextColor={textColor}>

        </TextInput>
        <Pressable style={styles.button} onPress={() => { saveIP(ip); alert("Restart the app to take effect.") }}><ThemedText style={styles.text}>Set IP</ThemedText></Pressable>
        <Pressable style={styles.button} onPress={() => { resetFile("settings.json"); }}><ThemedText style={styles.text}>Reset settings</ThemedText></Pressable>
      </ThemedView>

    </SafeAreaView>


  );
}
