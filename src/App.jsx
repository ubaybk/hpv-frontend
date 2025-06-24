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
import AuthPages from './pages/admin/AuthPages';
import Dashboard from './pages/admin/Dashboard';
import ListPasien from './pages/admin/ListPasien';
import Periksa from './pages/admin/Periksa';
import PeriksaPasien from './pages/admin/PeriksaPasien';

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
      <Route path='/authPages' element={<AuthPages/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/listPasien' element={<ListPasien/>}/>
      <Route path='/periksaPasien/:id' element={<PeriksaPasien/>}/>
    </Routes>
  );
}

export default App;