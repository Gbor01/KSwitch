import { StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { saveFile } from '@/components/FileManager';
import { Ionicons } from '@expo/vector-icons';

function Checkbox({ onChange, checked }) {
    const colorScheme = useColorScheme();
    const textColor = colorScheme === "dark" ? "white" : "#151718"
    const tickColor = colorScheme === "dark" ? "#151718" : "white"
    const styles = StyleSheet.create({
        checkboxBase: {
            width: 24,
            height: 24,
            margin: 12,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderWidth: 2,
            borderColor: textColor,
            backgroundColor: "transparent",
        },
        checkboxChecked: {
            backgroundColor: textColor,
        },
    });
    return (
        <Pressable
            style={[styles.checkboxBase, checked && styles.checkboxChecked]}
            onPress={onChange}>
            {checked && <Ionicons name="checkmark-sharp" size={20} color={tickColor} />}
        </Pressable>
    );
}
export const Shelly = ({notify}) => {

    const colorScheme = useColorScheme();
    const color = colorScheme === "dark" ? "#151718" : "white"
    const textColor = colorScheme === "dark" ? "white" : "#151718"
    const [name, onChangeName] = useState('');
    const [id, onChangeID] = useState('');

    async function onPress() {
        if (name.length !== 0 && id.length !== 0)
        {

            await saveFile({ title: name, id: id, type: "shelly", shouldRepeat: false }, "settings.json")
            notify("Shelly button added!",1)

        }
        else
        {
            notify("Name and ID cannot be empty",0)
        }
        
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

    });


    return (
        <SafeAreaView style={{ backgroundColor: color, paddingTop: 0, flex: 1 }}>
            <ThemedView style={{ backgroundColor: color, flexDirection: "column" }}>
                <TextInput style={styles.input}
                    onChangeText={onChangeName}
                    placeholder="Switch Name"
                    placeholderTextColor={textColor}>

                </TextInput>
                <TextInput style={styles.input}
                    onChangeText={onChangeID}
                    placeholder="Switch ID"
                    placeholderTextColor={textColor}>

                </TextInput>
                <Pressable style={styles.button} onPress={onPress}><ThemedText style={styles.text}>Add Switch</ThemedText></Pressable>
            </ThemedView>
        </SafeAreaView>
    )
};

export const TOSR = ({notify}) => {

    const colorScheme = useColorScheme();
    const color = colorScheme === "dark" ? "#151718" : "white"
    const textColor = colorScheme === "dark" ? "white" : "#151718"
    const [name, onChangeName] = useState('');
    const [id, onChangeID] = useState('');
    const [shouldRepeat, setRepeat] = useState(false)

    async function onPress() {
        if (name.length !== 0 && id.length !== 0)
        {
            await saveFile({ title: name, id: id, type: "tosr", shouldRepeat: shouldRepeat }, "settings.json")
            notify("TOSR button added!",1)
        }
        else
        {
            notify("Name and number cannot be empty",0)
        }
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
        paragraph: {
            fontSize: 15,
            color: textColor,
        },
        checkbox: {
            margin: 8,
            backgroundColor: "black",

        },
        section: {
            margin: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });


    return (
        <SafeAreaView style={{ backgroundColor: color, paddingTop: 0, flex: 1 }}>
            <ThemedView style={{ backgroundColor: color, flexDirection: "column" }}>


                <TextInput style={styles.input}
                    onChangeText={onChangeName}
                    placeholder="Switch Name"
                    placeholderTextColor={textColor}>

                </TextInput>
                <TextInput style={styles.input}
                    onChangeText={onChangeID}
                    placeholder="Switch number"
                    placeholderTextColor={textColor}>

                </TextInput>
                <ThemedView style={styles.section}>
                    <Checkbox onChange={() => setRepeat(!shouldRepeat)} checked={shouldRepeat} />
                    <Text style={styles.paragraph}>Should repeat?</Text>
                </ThemedView>
                <Pressable style={styles.button} onPress={onPress}><ThemedText style={styles.text}>Add Switch</ThemedText></Pressable>


            </ThemedView>


        </SafeAreaView>
    )
};