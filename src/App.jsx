import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import IdentitasForm from './components/IdentitasForm';
import RiwayatIdentitasForm from './components/RiwayatIdentitasForm';
import RiwayatKesehatanReproduksiForm from './components/RiwayatKesehatanReproduksiForm';
import RiwayatKankerDalamKeluargaForm from './components/RiwayatKankerDalamKeluargaForm';
import KeluhanForm from './components/KeluhanForm';
import CekNik from './pages/CekNik';
import LihatHasil from './pages/LihatHasil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/identitasPasien" element={<IdentitasForm />} />
      <Route path="/riwayatIdentitas/:id" element={<RiwayatIdentitasForm />} />
      <Route path="/riwayatReproduksi/:id" element={<RiwayatKesehatanReproduksiForm/>}/>
      <Route path="/riwayatKankerDalamKeluarga/:id" element={<RiwayatKankerDalamKeluargaForm/>}/>
      <Route path="/keluhanForm/:id" element={<KeluhanForm/>}/>
      <Route path="/cekNik" element={<CekNik/>}/>
      <Route path="/lihatHasil/:id" element={<LihatHasil/>}/>
    </Routes>
  );
}

export default App;