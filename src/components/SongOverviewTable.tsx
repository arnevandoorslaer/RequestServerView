import { Song } from '../model/song';

const SongOverviewTable = ({ songs }) => {
  return (
    <>
      <table className='table table-striped table-dark'>
        {songs && songs?.length && songs?.length > 0 && (
          <thead>
            <tr>
              <th>NEXT UP: {songs?.length} songs</th>
            </tr>
          </thead>
        )}
        <tbody>
          {songs &&
            songs.map((song: Song) => (
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
    </>
  );
};

export default SongOverviewTable;
