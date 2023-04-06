import { useAtom } from 'jotai';
import { searchError, selectedSongAtom } from '../services/songStore';
const NotifBar = () => {
  const [error, setError] = useAtom(searchError);
  const [selectedSong, setSelectedSong] = useAtom(selectedSongAtom);

  setTimeout(() => {
    setSelectedSong(null);
    setError(null);
  }, 5000);

  return (
    <>
      {selectedSong && selectedSong.title && (
        <div className='alert alert-success mt-3'>
          ADDED {selectedSong.title}
        </div>
      )}
      {error && (
        <div className='alert alert-danger mt-3'>Something went wrong...</div>
      )}
    </>
  );
};

export default NotifBar;
