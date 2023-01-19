import { useState } from 'react';
import NotifBar from '../components/NotifBar';
import SearchBar from '../components/SearchBar';
import SongOverviewTable from '../components/SongOverviewTable';
import SongSearchTable from '../components/SongSearchTable';
import { useSongFirestore } from '../hooks/useFirestore';

export default function Home() {
  const { docs } = useSongFirestore('song');
  const [searchSongs, setSearchSongs] = useState<any>();
  const [selectedSong, setSelectedSong] = useState();
  const [error, setError] = useState();

  const songIds = docs?.map((doc) => doc.video_id);

  return (
    <main className='container'>
      <NotifBar
        song={selectedSong}
        error={error}
        setSelected={setSelectedSong}
        setError={setError}
      ></NotifBar>
      <SearchBar setSongs={setSearchSongs} setError={setError} />
      <SongSearchTable
        songs={searchSongs?.filter((song) => !songIds?.includes(song.video_id))}
        setSongs={setSearchSongs}
        setSelectedSong={setSelectedSong}
      />
      <SongOverviewTable songs={docs} />
    </main>
  );
}
