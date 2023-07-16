import './App.css';
import End from './cmps/End';
import Home from './cmps/Home';
import UploadFiles from './cmps/UploadFiles';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <h1><a href="/">MP3 to Spotify</a></h1>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='uploadFiles/' element={<UploadFiles />} />
          <Route path='end/' element={<End />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
