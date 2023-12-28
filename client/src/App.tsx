import { Route, Routes } from 'react-router-dom';
import './App.css';
import Store from './Store';
import Inventory from './Inventory';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Store />}></Route>
      <Route path='/inventory' element={<Inventory />}></Route>
    </Routes>
    );
}

export default App
