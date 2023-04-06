import NotifBar from '../components/NotifBar';
import SearchBar from '../components/SearchBar';
import SongOverviewTable from '../components/SongOverviewTable';
import SongSearchTable from '../components/SongSearchTable';

export default function Home() {
  return (
    <main className='container'>
      <NotifBar></NotifBar>
      <SearchBar />
      <SongSearchTable />
      <SongOverviewTable />
    </main>
  );
}
