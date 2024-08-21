import { View, Pressable, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState, useRef } from 'react';
import { readFile } from './FileManager';
import TcpSocket from 'react-native-tcp-socket';
import { removeFile } from './FileManager';

var auth_key = "";
var ip_address = "";
var message = ""

// https://github.com/amorphic/tosr0x és ChatGPT
function convertHexToInt(hexChars: string): number[] {
  try {
    const ints = Array.from(hexChars).map(char => char.charCodeAt(0));
    return ints;
  } catch (error) {
  }
  return [];
}

function convertHexToBinStr(hexChars: string): string {
  const response = convertHexToInt(hexChars)[0];
  const responseBinary = response.toString(2);
  return responseBinary;
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function setup() {
  var key = await readFile("api.json")
  if (key.length <= 0) {
    return 0;
  }
  auth_key = JSON.parse(key)["api"]

  key = await readFile("ip.json")
  if (key.length <= 0) {
    return 0;
  }
  ip_address = JSON.parse(key)["ip"].split(":")
  fetchTOSRDevice()
}
setup()

async function fetchShellyData(auth_key: string, id: string): Promise<boolean> {
  var status = false
  await fetch('https://shelly-11-eu.shelly.cloud/device/status?id=' + id + '&auth_key=' + auth_key + '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json()).then(async json => {
    status = json["data"]["device_status"]["relays"][0]["ison"]
  })
  return status
}


async function switchShellyDevice(auth_key: string, id: string): Promise<boolean> {
  var status = false
  if (await fetchShellyData(auth_key, id) == false) {
    await fetch('https://shelly-11-eu.shelly.cloud/device/relay/control?auth_key=' + auth_key + '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'turn=on&id=' + id + '&channel=0'
    }).then(response => response.json()).then(json => {
      if (json["isok"] == true) {
        status = true
      }
    });
  }
  else {
    await fetch('https://shelly-11-eu.shelly.cloud/device/relay/control?auth_key=' + auth_key + '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'turn=off&id=' + id + '&channel=0'
    }).then(response => response.json()).then(json => {
      if (json["isok"] == true) {
        status = false
      }
    });
  }
  return status
};

async function fetchTOSRDevice() {
  const client = await TcpSocket.createConnection({
    port: Number(ip_address[1]),
    host: ip_address[0],

  }, () => { });
  client.setTimeout(5000) // Ennek itt valószínüleg semmi érteleme, de valamiért csak ezzel működik szóval itt marad
  client.on('connect', () => {
    client.write("[")
  });

  client.on('data', (msg) => {
    message = convertHexToBinStr(msg.toString()).padStart(8, '0').split('').reverse().join('');
    if (msg.toString() != "*HELLO*") {
      client.end()
    }

  });
}

async function switchTOSRDevice(data: string, repeat: boolean) {
  const client = await TcpSocket.createConnection({
    port: Number(ip_address[1]),
    host: ip_address[0],
  }, () => {

  });
  client.setTimeout(1500) // Ahogy ennek sincs sok értelme
  client.on('data', async () => {
    if (repeat) {
      client.write(data[0])
      await delay(1500)
      client.write(data[1])
      await delay(500)
      client.end()
      return
    }
    await delay(300)
    client.write(data)
    await delay(500)
    client.end()
  });
}

const ShellyButton = (title: string, id: string, repeat: boolean,onRemove:any) => {
  const [isPressed, setIsPressed] = useState(false);
  const [onHold, setOnHold] = useState(0)
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black"
  const buttonBackground = colorScheme === "dark" ? "#151718" : "white"
  const pressedButton = colorScheme === "dark" ? "white" : "black"
  const [isDisabled, setIsDisabled] = useState(false);
  const [removeDisabled, setRemoveDisabled] = useState(true);
  
  useEffect(() => {
    const loadInitialValue = async () => {
      const initialValue = await fetchShellyData(auth_key, id);
      setIsPressed(initialValue);
    };
    loadInitialValue()
  }, []);
  const handlePress = async () => {
    setIsPressed((await switchShellyDevice(auth_key, id)).valueOf())
    setIsDisabled(true)
    await delay(1000)
    setIsDisabled(false)
  };


  const removeButton = async () => {
    await removeFile(id)
    onRemove()
  }

  return <Pressable onLongPress={() => {setOnHold(1); setRemoveDisabled(false)}} onTouchEnd={async () => {await delay(3000); setOnHold(0); setRemoveDisabled(true)}} style={{ borderWidth: 2, borderColor: color, margin: 25, alignSelf: "flex-start", borderRadius: 25, flex: 1, }}>
  <View>
    <Pressable
    style={[ { position:"absolute", alignSelf:"flex-end", padding:10, opacity:onHold }]} disabled={removeDisabled} onPress={()=>{
      removeButton()
      
    }}>
    <Ionicons name="trash" size={36} style={{color: pressedButton }} />
  </Pressable>
    <Pressable
      style={[isPressed ? stlyes.buttonPressed : stlyes.button, { backgroundColor: buttonBackground, shadowColor: pressedButton, }]}
      disabled={isDisabled}
      onPress={handlePress}>
      <Ionicons name="power" size={48} style={{ color: isPressed ? pressedButton : "grey" }} />
    </Pressable>
    <ThemedText style={{ alignSelf: "center", marginBottom: 25, fontWeight: "bold" }}>{title}</ThemedText>
  </View>
  </Pressable>;
}

// https://github.com/amorphic/tosr0x
const switches = {
  "1": { "0": "d", "1": "e", "2": "f", "3": "g", "4": "h", "5": "i", "6": "j", "7": "k", "8": "l" },
  "0": { "0": "n", "1": "o", "2": "p", "3": "q", "4": "r", "5": "s", "6": "t", "7": "u", "8": "v" },
}

const TOSRButton = (title: string, id: string, repeat: boolean,onRemove:any) => {
  const [onHold, setOnHold] = useState(0)
  const [isPressed, setIsPressed] = useState(false);
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black"
  const buttonBackground = colorScheme === "dark" ? "#151718" : "white"
  const pressedButton = colorScheme === "dark" ? "white" : "black"
  const turnOn = switches["1"][id]
  const turnOff = switches["0"][id]
  const [removeDisabled, setRemoveDisabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadInitialValue = setInterval(() => {

      var initialValue = message[Number(id) - 1] == "1" ? true : false
      setIsPressed(initialValue);
      if (message.length != 0) {
        clearInterval(loadInitialValue)
      }
    }, 500);
    return () => clearInterval(loadInitialValue);
  }, []);
  const removeButton = async () => {
    await removeFile(id)
    onRemove()
  }


  const handlePress = async () => {
    if (repeat == true) {
      switchTOSRDevice(turnOn + turnOff, true)
      return
    }
    // Ettől a pár sortól itt alul fáj a szemem. Majd valamit kezdek vele mert ez így nem maradhat.
    if (isPressed == false) {
      switchTOSRDevice(turnOn, false)
      setIsPressed(true)
      setIsDisabled(true)
      await delay(1200)
      setIsDisabled(false)
      return
    }
    switchTOSRDevice(turnOff, false)
    setIsPressed(false)
    setIsDisabled(true)
    await delay(1200)
    setIsDisabled(false)
  };
  // Ui. a fenti cucchoz: a  sok delay az időzítés miatt kell mert különben megőrül a kapcsoló. 

  return <Pressable onLongPress={() => {setOnHold(1); setRemoveDisabled(false)}} onTouchEnd={async () => {await delay(3000); setOnHold(0); setRemoveDisabled(true)}} style={{ borderWidth: 2, borderColor: color, margin: 25, alignSelf: "flex-start", borderRadius: 25, flex: 1, }}>
    <View>
  <Pressable
    style={[ { position:"absolute", alignSelf:"flex-end", padding:10, opacity:onHold }]} disabled={removeDisabled} onPress={()=>{
      removeButton()
      
    }}>
    <Ionicons name="trash" size={36} style={{color: pressedButton }} />
  </Pressable>

  
  <Pressable
    style={[isPressed ? stlyes.buttonPressed : stlyes.button, { backgroundColor: buttonBackground, shadowColor: pressedButton, }]}
    disabled={isDisabled}
    onPress={handlePress}>
    <Ionicons name="power" size={48} style={{ color: isPressed ? pressedButton : "grey" }} />
  </Pressable>
  <ThemedText style={{ alignSelf: "center", marginBottom: 25, fontWeight: "bold" }}>{title}</ThemedText>

</View></Pressable>

  
}

const components = {
  "shelly": ShellyButton,
  "tosr": TOSRButton
}

export const SwitchButton = ({ title, id, type, repeat,onRemove }) => {
  
  return components[type](title, id, repeat,onRemove);
}

const stlyes = StyleSheet.create({
  buttonPressed: {
    shadowColor: 'white',
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 15,
    elevation: 50,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 85,
    height: 85,
    backgroundColor: 'white',
    borderRadius: 50,
    margin: 20,
    alignSelf: "center",
  },
  button: {
    shadowColor: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    shadowOffset: undefined,
    elevation: undefined,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 85,
    height: 85,
    backgroundColor: 'grey',
    borderRadius: 50,
    margin: 20,
    alignSelf: "center"
  }
})