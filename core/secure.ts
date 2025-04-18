// import EncryptedStorage from "react-native-encrypted-storage"
// import utils from "./utils"


import * as SecureStore from "expo-secure-store";
import utils from "./utils";

async function set(key: string, object: any) {
  //utils.log(key);
  //utils.log(object);
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(object));
  } catch (error) {
    console.log('secure.set:', error);
  }
}

async function get(key: string) {
  try {
    const data = await SecureStore.getItemAsync(key);
    if (data !== undefined && data !== null) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('secure.get:', error);
  }
}

async function remove(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('secure.remove:', error);
  }
}

async function wipe() {
  try {
    // SecureStore does not have a built-in "clear all" method.
    console.log('SecureStore does not support clearing all items at once.');
  } catch (error) {
    console.log('secure.wipe:', error);
  }
}

export default { set, get, remove, wipe };