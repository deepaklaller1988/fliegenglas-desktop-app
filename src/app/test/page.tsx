"use client";

import React, { useState, useEffect } from "react";

const TestAudioPlayer = () => {
  const [audioUrl, setAudioUrl] = useState<string>("");

  // Function to convert ArrayBuffer to Uint8Array (if needed)
  const arrayBufferToUint8Array = (arrayBuffer: ArrayBuffer): Uint8Array => {
    return new Uint8Array(arrayBuffer);
  };

  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Replace these with your actual database and store names
        const dbName = "audioDB";
        const storeName = "audios";
        const key = 76771; // Replace with the actual key

        const uint8Array: any = await getAudioDataFromIndexedDB(
          dbName,
          storeName,
          key
        );
        if (!uint8Array) throw new Error("No data found for the given key.");
        console.log(uint8Array);

        // console.log(audioBlob, uint8Array?.audios[0]?.data, "ooooooo");

        let nn: any = new Uint8Array(uint8Array?.audios[0]?.data);

        console.log(nn, "NN");

        const audioBlob = new Blob([nn], {
          type: "audio/mpeg",
        });

        console.log(audioBlob, "audioBlob");

        const testAudioUrl = URL.createObjectURL(audioBlob);

        console.log(testAudioUrl, "testAudioUrl");

        setAudioUrl(testAudioUrl);

        return () => {
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }
        };
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();
  }, []);

  // Function to retrieve data from IndexedDB using db_name, store_name, and key
  const getAudioDataFromIndexedDB = async (
    db_name: string,
    store_name: string,
    key: IDBValidKey
  ): Promise<Uint8Array | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(db_name);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([store_name], "readonly");
        const store = transaction.objectStore(store_name);
        const dataRequest = store.get(key);

        dataRequest.onsuccess = () => {
          resolve((dataRequest.result as Uint8Array) || null);
        };

        dataRequest.onerror = (event) => {
          reject((event as any).target.error);
        };
      };

      request.onerror = (event) => {
        reject((event as any).target.error);
      };
    });
  };

  return (
    <div>
      <audio
        src={audioUrl}
        controls
        autoPlay
        onPlay={() => console.log("Playing")}
        onPause={() => console.log("Paused")}
        onError={(event) => {
          const error = event.nativeEvent;
          console.error("Playback error:", error);
        }}
      />
    </div>
  );
};

export default TestAudioPlayer;
