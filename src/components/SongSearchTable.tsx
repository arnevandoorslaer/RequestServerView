import { Song } from '../model/song';
import { songFirestore, timestamp } from '../firebase/config';
import { selectedSongAtom, songSearchList } from '../services/songStore';
import { useAtom } from 'jotai';

const SongSearchTable = () => {
  const [songs, setSongs] = useAtom(songSearchList);
  const [, setSelectedSong] = useAtom(selectedSongAtom);

  const addSong = (song: Song) => {
    setSelectedSong(song);
    songFirestore.collection('song').add({ ...song, added: timestamp() });
    setSongs([]);
  };

  return (
    <>
      {songs && songs.length > 0 && (
        <table className='table table-striped table-dark'>
          <tbody>
            {songs &&
              songs.map((song: Song) => (
                <tr key={song.video_id} onClick={() => addSong(song)}>
                  <td className='text-center'>
                    <strong>{song.title}</strong>
                    <br />
                    {song.artist}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default SongSearchTable;
