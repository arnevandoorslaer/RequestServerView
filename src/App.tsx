import './App.css';

import useFirestore from './hooks/useFirestore';

import SearchBar from './components/SearchBar';
import SongOverviewTable from './components/SongOverviewTable';
import { useState } from 'react';
import SongSearchTable from './components/SongSearchTable';
import NotifBar from './components/NotifBar';

function App() {
  const { docs } = useFirestore('song');
  const [searchSongs, setSearchSongs] = useState();
  const [selectedSong, setSelectedSong] = useState();
  const [error, setError] = useState();

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
        songs={searchSongs}
        setSongs={setSearchSongs}
        setSelectedSong={setSelectedSong}
      />
      <SongOverviewTable songs={docs} />
    </main>
  );
}

export default App;
