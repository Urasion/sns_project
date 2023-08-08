import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './pages/Main/Main';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/"></Route>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/propile"></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
