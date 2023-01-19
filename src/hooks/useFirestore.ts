import { useEffect, useState } from 'react';
import { songFirestore } from '../firebase/config';
import { Song } from '../model/song';

const useSongFirestore = (collection) => {
  const [docs, setDocs] = useState<Song[] | undefined>();

  useEffect(() => {
    const ubsub = songFirestore
      .collection(collection)
      .orderBy('added')
      .onSnapshot((snap) => {
        let documents: Song[] = [];
        snap.forEach((doc) => {
          documents.push({ ...doc.data(), id: doc.id } as Song);
        });
        setDocs(documents);
      });

    return () => ubsub();
  }, [collection]);

  return { docs };
};
const useControlFirestore = (collection) => {
  const [docs, setDocs] = useState<any[] | undefined>();

  useEffect(() => {
    const ubsub = songFirestore.collection(collection).onSnapshot((snap) => {
      let documents: Song[] = [];
      snap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id } as any);
      });
      setDocs(documents);
    });

    return () => ubsub();
  }, [collection]);

  return { docs };
};

export { useSongFirestore, useControlFirestore };
