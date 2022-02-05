import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Dashboard } from './features/dashboard/dashboard';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Counter />} /> */}
        <Route path='/' element={<Dashboard/>} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
