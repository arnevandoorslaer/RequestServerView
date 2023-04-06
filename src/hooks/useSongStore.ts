import { useEffect } from 'react';
import { songFirestore } from '../firebase/config';
import { Song } from '../model/song';
import { useAtom } from 'jotai';
import { songList } from '../services/songStore';

const useSongStore = () => {
  const [, setSongs] = useAtom(songList);

  useEffect(() => {
    const unsub = songFirestore
      .collection('song')
      .orderBy('added')
      .onSnapshot((snap) => {
        const documents: Song[] = [];
        snap.forEach((doc) => {
          documents.push({ ...doc.data(), id: doc.id } as Song);
        });
        setSongs(documents);
      });

    return () => unsub();
  }, [setSongs]);

};

export { useSongStore };
