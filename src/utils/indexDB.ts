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
