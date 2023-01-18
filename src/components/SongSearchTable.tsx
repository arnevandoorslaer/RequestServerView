import { Song } from '../model/song';
import { songFirestore, timestamp } from '../firebase/config';

const SongSearchTable = ({ songs, setSongs, setSelectedSong }) => {
  const addSong = (song: Song) => {
    console.log(song);
    setSelectedSong(song);
    songFirestore.collection('song').add({ ...song, added: timestamp() });
    setSongs([]);
  };

  return (
    <>
      {songs && (
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
