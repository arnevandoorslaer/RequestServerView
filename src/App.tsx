import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/home';
import Player from './pages/player';
import Staff from './pages/staff';

function App() {
  return (
    <>
      <HashRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='*' element={<Home />} />
            <Route path='player' element={<Player />} />
            <Route path='staff' element={<Staff />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
