"use client";

import { useState } from "react";
import { generateToken } from "utils/token";

const indexDBSetup = async () => {
  const dbPromise = indexedDB.open("mp3DB", 1);

  dbPromise.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains("mp3Store")) {
      db.createObjectStore("mp3Store");
    }
  };

  return new Promise<IDBDatabase>((resolve, reject) => {
    dbPromise.onsuccess = (event) =>
      resolve((event.target as IDBOpenDBRequest).result);
    dbPromise.onerror = () => reject(new Error("Failed to open IndexedDB"));
  });
};

const storeMp3InDB = async (data: ArrayBuffer) => {
  const db = await indexDBSetup();
  const transaction = db.transaction("mp3Store", "readwrite");
  const store = transaction.objectStore("mp3Store");
  store.put(data, "mp3File");
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(new Error("Failed to store MP3 in IndexedDB"));
  });
};

const retrieveMp3FromDB = async (): Promise<ArrayBuffer | null> => {
  const db = await indexDBSetup();
  const transaction = db.transaction("mp3Store", "readonly");
  const store = transaction.objectStore("mp3Store");
  return new Promise<ArrayBuffer | null>((resolve, reject) => {
    const request = store.get("mp3File");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("Failed to retrieve MP3 from IndexedDB"));
  });
};

const playAudioFromDB = async () => {
  try {
    const audioData = await retrieveMp3FromDB();
    if (!audioData) {
      alert("No MP3 file found in IndexedDB");
      return;
    }

    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.play();
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};

const downloadAndStoreMp3 = async () => {
  let payload = {
    remoteAudioUrl:
      "https://fliegenglas.app/wp-content/uploads/2024/07/22gg240800.mp3",
    audioName: "test-audio.mp3",
  };
  let token = await generateToken(payload);
  const response = await fetch("/api/download-audio", {
    method: "POST",
    body: JSON.stringify(token),
  });
  const data = await response.arrayBuffer();
  await storeMp3InDB(data);
};

const Home = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadAndStoreClick = async () => {
    setLoading(true);
    try {
      await downloadAndStoreMp3();
      alert("MP3 file stored in IndexedDB");
    } catch (error) {
      console.log(error, "ERROR");
      alert("Error storing MP3 file");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = async () => {
    await playAudioFromDB();
  };

  return (
    <div>
      <h1>Download, Store, and Play MP3</h1>
      <button onClick={handleDownloadAndStoreClick} disabled={loading}>
        {loading ? "Processing..." : "Download and Store MP3"}
      </button>
      <button onClick={handlePlayClick} disabled={loading}>
        Play MP3 from IndexedDB
      </button>
    </div>
  );
};

export default Home;
