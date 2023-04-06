import { useEffect, useState } from 'react';
import { songFirestore } from '../firebase/config';
import { controlList, songList } from '../services/songStore';
import { useAtom } from 'jotai';

export default function Staff() {
  const [controls] = useAtom(controlList);
  const [songs] = useAtom(songList);

  const firstDoc = controls?.at(0) ?? {};
  const { volume, paused } = firstDoc;

  const [vol, setVolume] = useState(volume);
  const [pause, setPaused] = useState(paused);

  useEffect(() => {
    if (firstDoc.id && vol) {
      songFirestore
        .collection('control')
        .doc(firstDoc.id)
        .update({ volume: vol });
    }
  }, [vol, firstDoc.id]);

  useEffect(() => {
    if (firstDoc.id && pause !== undefined) {
      songFirestore
        .collection('control')
        .doc(firstDoc.id)
        .update({ paused: pause });
    }
  }, [pause, firstDoc.id]);

  const skipSong = () => {
    const current = songs?.at(0);
    if (current) {
      songFirestore.collection('song').doc(current.id).delete();
    }
  };

  return (
    <main className='d-flex justify-content-center'>
      <div className='mt-5 col-6 col-md-4'>
        <label className='text-light form-label w-100'>Volume {volume}%</label>
        <input
          className='w-100 form-range mb-5'
          type='range'
          min='0'
          max='100'
          value={volume ?? 0}
          onChange={(e) => setVolume(e.target.value)}
          id='sliderRange'
        />
        <button
          className='btn btn-dark w-100 mb-4'
          onClick={() => {
            setPaused((isPaused: boolean) => !isPaused);
          }}
        >
          {paused ? 'UNPAUSE' : 'PAUSE'}
        </button>
        <button className='btn btn-danger w-100' onClick={skipSong}>
          SKIP
        </button>
      </div>
    </main>
  );
}
