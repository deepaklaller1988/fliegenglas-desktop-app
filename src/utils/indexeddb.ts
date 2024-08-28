const DB_NAME = 'audioDB';
const STORE_NAME = 'audios';

export const openDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'categoryID' });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveAudios = async (
    categoryID: string,
    categoryName: string,
    primaryCategory: string,
    imageUrl: string,
    shareurl: string,
    newAudios: Array<{ id: string; data: ArrayBuffer; title: string; duration: string; name: string; }>
) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const existingEntry = await new Promise<any>((resolve, reject) => {
        const request = store.get(categoryID);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    let audios = newAudios;

    if (existingEntry) {
        audios = [...existingEntry.audios, ...newAudios];
    }

    store.put({
        categoryID,
        categoryName,
        primaryCategory,
        shareurl,
        imageUrl,
        audios,
    });

    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAudioByID = async (categoryID: string) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(categoryID);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to get audio by ID', error);
        throw error;
    }
};

export const getAll = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        // Use the getAll method to retrieve all records
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to get all records', error);
        throw error;
    }
};

export const deleteAudioByID = async (categoryID: string) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.delete(categoryID);

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to delete audio by ID', error);
        throw error;
    }
};

export const deleteAll = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Use the clear method to delete all records
        const request = store.clear();

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to delete all records', error);
        throw error;
    }
};