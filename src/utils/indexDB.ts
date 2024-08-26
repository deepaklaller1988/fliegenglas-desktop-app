import { openDB } from 'idb';

const DATABASE_NAME = '__fliegenglas';
const STORE_NAME = 'data';

async function initDB() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveData(key: string, value: any): Promise<void> {
  const db = await initDB();
  if (Array.isArray(value)) {
    await db.put(STORE_NAME, JSON.stringify(value), key);
  } else {
    await db.put(STORE_NAME, value, key);
  }
}

export async function getData(key: string): Promise<any> {
  const db = await initDB();
  const data = await db.get(STORE_NAME, key);

  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export async function putData(key: string, value: any): Promise<void> {
  return saveData(key, value);
}

export async function deleteData(keysToRemove: string[]): Promise<void> {
  try {
    const db = await initDB();

    for (const key of keysToRemove) {
      await db.delete(STORE_NAME, key);
    }
  } catch (error) {
    console.error('Error deleting data from IndexedDB:', error);
  }
}

export async function removeIndexDbData(): Promise<void> {
  const keysToRemove = ['channelData', 'order-data', 'tags'];

  try {
    await deleteData(keysToRemove);
    console.log('Data successfully removed from IndexedDB.');
  } catch (error) {
    console.error('Error in removeIndexDbData:', error);
  }
}