import * as SecureStore from "expo-secure-store";

async function set(key: string, object: any) {
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
    await SecureStore.deleteItemAsync("credentials");
    await SecureStore.deleteItemAsync("tokens");
  } catch (error) {
    console.log('secure.wipe:', error);
  }
}

export default { set, get, remove, wipe };