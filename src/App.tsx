import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/home';
import Player from './pages/player';
import Staff from './pages/staff';
import Login from './pages/login';
import { useUser } from './hooks/useUser';
import { useSongStore } from './hooks/useSongStore';
import { useControlStore } from './hooks/useControlStore';

function App() {
  const { user, authorized } = useUser();
  useSongStore();
  useControlStore();

  return (
    <HashRouter>
      <NavBar></NavBar>
      <Routes>
        <Route path='/'>
          <Route index element={<Home />} />
          <Route path='*' element={<Home />} />
          <Route path='player' element={<Player />} />
          {authorized && <Route path='staff' element={<Staff />} />}
          {!user && <Route path='login' element={<Login />} />}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
