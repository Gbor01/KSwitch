import * as FileSystem from 'expo-file-system';
export async function readFile(file: string): Promise<string> {
  try {
    return await FileSystem.readAsStringAsync(FileSystem.documentDirectory! + file)
  }
  catch (e) {
    return "";
  }

}
export async function saveFile(data: any, file: string) {
  var readData = await readFile(file)
  if (readData.length == 0) {
    console.log(readData.length)
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory! + file,
      JSON.stringify([])
    )
    saveFile(data, file)
  }

  const list = JSON.parse(readData)
  var data_save = data
  const length = list.length
  data_save["slot"] = length

  var newList = [...list, data_save]
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory! + file,
    JSON.stringify(newList)
  )
}

export async function saveAPI(api: string) {
  const data = { "api": api }
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory! + "api.json", JSON.stringify(data))
}
export async function saveIP(ip: string) {
  const data = { "ip": ip }
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory! + "ip.json", JSON.stringify(data))
}
export async function resetFile(file: string) {
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory! + file,
    "[]"
  )
}

export async function removeFile(id: string) {
  var readData = JSON.parse(await readFile("settings.json"))
  var list = readData.filter(obj => obj.id !== id)
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory! + "settings.json",
    JSON.stringify(list)
  )
}