import { useEffect } from 'react';
import { songFirestore } from '../firebase/config';
import { useAtom } from 'jotai';
import { controlList } from '../services/songStore';

const useControlStore = () => {
  const [, setControls] = useAtom(controlList);

  useEffect(() => {
    const unsub = songFirestore.collection('control').onSnapshot((snap) => {
      const documents: any[] = [];
      snap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id } as any);
      });
      setControls(documents);
    });

    return () => unsub();
  }, [setControls]);

};

export { useControlStore };
