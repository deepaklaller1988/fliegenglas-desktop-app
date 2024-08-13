import { openDB } from 'idb';

const DATABASE_NAME = '__fliegenglas';
const STORE_NAME = 'data';

// Initialize IndexedDB
async function initDB() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// Save data to IndexedDB
export async function saveData(key: string, value: any): Promise<void> {
  const db = await initDB();
  // Check if value is an array, if so store it as a single entry
  if (Array.isArray(value)) {
    await db.put(STORE_NAME, JSON.stringify(value), key);
  } else {
    await db.put(STORE_NAME, value, key);
  }
}

// Get data from IndexedDB
export async function getData(key: string): Promise<any> {
  const db = await initDB();
  const data = await db.get(STORE_NAME, key);
  
  // Check if the data is a JSON string (array), and parse it if so
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}
