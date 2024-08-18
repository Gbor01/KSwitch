import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Shelly, TOSR } from '@/components/Settings';

export default function AddScreen() {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#151718" : "white"
  const textColor = colorScheme === "dark" ? "white" : "#151718"
  const [selectedMenu, onMenuChange] = useState("shelly")
  const data = [
    { label: 'Shelly', value: "shelly" },
    { label: 'TOSR Arduino', value: 'tosr' },

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
      width: "90%",
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

  const Component = components[selectedMenu];

  return (

    <SafeAreaView style={{ backgroundColor: color, paddingTop: 0, flex: 1 }}>
      <ThemedView style={{ backgroundColor: color, flexDirection: "column" }}>

        <Dropdown
          style={[styles.dropdown, { borderColor: textColor }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}

          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Select Switch Type'}
          value={selectedMenu}

          onChange={item => {
            onMenuChange(item.value);

          }}

        />


      </ThemedView>
      <Component></Component>
    </SafeAreaView>


  );
}
