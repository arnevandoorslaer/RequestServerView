import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/home';
import Test from './pages/test';

function App() {
  return (
    <>
      <HashRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='*' element={<Home />} />
            <Route path='test' element={<Test />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
