import { Song } from '../model/song';

const SongOverviewTable = ({ songs }) => {
  return (
    songs &&
    songs.length > 0 && (
      <table className='table table-striped table-dark'>
        <thead>
          <tr>
            <th>NEXT UP: {songs?.length} songs</th>
          </tr>
        </thead>

        <tbody>
          {songs.map((song: Song) => (
            <tr key={song.id}>
              <td className='text-center'>
                <strong>{song.title}</strong>
                <br />
                {song.artist}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

export default SongOverviewTable;
