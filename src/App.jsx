import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import IdentitasPasien from './pages/IdentitasPasien';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/identitasPasien" element={<IdentitasPasien />} />
    </Routes>
  );
};

export default App;