import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {  Link } from 'react-router-dom'; // Untuk ambil state dari halaman sebelumnya
import { User, Heart, Shield, Stethoscope, FileText, Calendar, MapPin, Phone, Activity, TestTube } from 'lucide-react';

const PeriksaPasien = () => {
  const { id: identitasPasienId } = useParams();

  const [data, setData] = useState({
    riwayat: {},
    reproduksi: {},
    kankerKeluarga: {},
    keluhan: {},
    pasien: {}
  });

  const [labData, setLabData] = useState({
    noLab: '',
    tanggalPengambilanSampel: '',
    asalFaskes: '',
    tanggalSampelDiterima: '',
    tanggalPemeriksaan: '',
    jenisPemeriksaan: '',
    subType16: '',
    subType52: '',
    subTypeLainnya: '',
    nilaiNormal: '',
    metodePemeriksaan: '',
    ivaTest: '',
    sadanis: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan state ini

  // Fetch semua data berdasarkan identitasPasienId
  useEffect(() => {
    const fetchData = async () => {
      if (!identitasPasienId) {
        setError('ID Pasien tidak ditemukan.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [
          pasienRes,
          riwayatRes,
          reproduksiRes,
          kankerRes,
          keluhanRes
        ] = await Promise.all([
          fetch(`http://localhost:3000/api/pasien/${identitasPasienId}`).then(res => res.json()),
          fetch(`http://localhost:3000/api/riwayat/${identitasPasienId}`).then(res => res.json()),
          fetch(`http://localhost:3000/api/riwayat-reproduksi/${identitasPasienId}`).then(res => res.json()),
          fetch(`http://localhost:3000/api/kanker-keluarga/${identitasPasienId}`).then(res => res.json()),
          fetch(`http://localhost:3000/api/keluhan/${identitasPasienId}`).then(res => res.json()),
        ]);

        setData({
          pasien: pasienRes || {},
          riwayat: riwayatRes || {},
          reproduksi: reproduksiRes || {},
          kankerKeluarga: kankerRes || {},
          keluhan: keluhanRes || {},
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data pasien.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [identitasPasienId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLabData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmitLab = async () => {
  try {
    setIsSubmitting(true);

    const requiredFields = ['noLab', 'tanggalPengambilanSampel', 'asalFaskes', 'jenisPemeriksaan'];
    const missingFields = requiredFields.filter(field => !labData[field]);
    if (missingFields.length > 0) {
      alert(`Harap lengkapi field: ${missingFields.join(', ')}`);
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    const formattedData = {
      ...labData,
      identitasPasienId: parseInt(identitasPasienId),
      userId: 1,
      // Pastikan semua tanggal dalam format ISO
      tanggalPengambilanSampel: new Date(labData.tanggalPengambilanSampel).toISOString(),
      tanggalSampelDiterima: labData.tanggalSampelDiterima ? new Date(labData.tanggalSampelDiterima).toISOString() : null,
      tanggalPemeriksaan: labData.tanggalPemeriksaan ? new Date(labData.tanggalPemeriksaan).toISOString() : null
    };

    const response = await fetch('http://localhost:3000/api/lab', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Gagal menyimpan hasil laboratorium');
    }

    const result = await response.json();
    alert('Hasil laboratorium berhasil disimpan!');
    window.location.href = '/listPasien';

  } catch (err) {
    console.error('Error submitting lab data:', err);
    alert(err.message || 'Gagal menyimpan hasil laboratorium.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Memuat data pasien...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 text-white">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Pemeriksaan Pasien
              </h1>
              <p className="text-pink-200 mt-1">ID Pasien: {identitasPasienId} • {data.pasien.nama}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Identitas Pasien */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-pink-300" />
              <h2 className="text-xl font-semibold text-white">Identitas Pasien</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Nama Lengkap</span>
                </div>
                <p className="text-white font-semibold">{data.pasien.nama}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-300">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">NIK</span>
                </div>
                <p className="text-white font-semibold">{data.pasien.nik}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-300">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">No. Telepon</span>
                </div>
                <p className="text-white font-semibold">{data.pasien.noHp}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-300">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Tanggal Lahir</span>
                </div>
                <p className="text-white font-semibold">{data.pasien.tanggalLahir}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-300">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Umur</span>
                </div>
                <p className="text-white font-semibold">{data.pasien.umur} tahun</p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Keluarga */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-blue-300" />
              <h2 className="text-xl font-semibold text-white">Riwayat Keluarga</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-3">Status Pernikahan</h3>
                  <div className="space-y-2">
                    <p><span className="text-blue-200">Klien:</span> <span className="text-white font-medium">{data.riwayat.statusKawinKlien}</span></p>
                    <p><span className="text-blue-200">Suami:</span> <span className="text-white font-medium">{data.riwayat.statusKawinSuami}</span></p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-3">Pendidikan & Pekerjaan</h3>
                  <div className="space-y-2">
                    <p><span className="text-blue-200">Pendidikan Klien:</span> <span className="text-white font-medium">{data.riwayat.pendidikanKlien}</span></p>
                    <p><span className="text-blue-200">Pekerjaan Klien:</span> <span className="text-white font-medium">{data.riwayat.pekerjaanKlien}</span></p>
                    <p><span className="text-blue-200">Pekerjaan Suami:</span> <span className="text-white font-medium">{data.riwayat.pekerjaanSuami || '-'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Reproduksi */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-green-300" />
              <h2 className="text-xl font-semibold text-white">Riwayat Kesehatan Reproduksi</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Usia Pertama Haid</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.usiaPertamaHaid || '-'} tahun</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Usia Pertama Kawin</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.usiaPertamaKawin || '-'} tahun</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Konsumsi Alkohol</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.konsumsiAlkohol ? 'Ya' : 'Tidak'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Masih Haid</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.masihHaid}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Melahirkan Normal</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.jumlahMelahirkanNormal} kali</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-green-300 text-sm">Melahirkan Caesar</p>
                <p className="text-white font-semibold text-lg">{data.reproduksi.jumlahMelahirkanCaesar} kali</p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Kanker Keluarga */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-orange-300" />
              <h2 className="text-xl font-semibold text-white">Riwayat Kanker Dalam Keluarga</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-orange-300 text-sm mb-2">Tumor Jinak Payudara/Ketiak</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.kankerKeluarga.tumorJinakPayudara ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  {data.kankerKeluarga.tumorJinakPayudara ? 'Ya' : 'Tidak'}
                </span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-orange-300 text-sm mb-2">Hubungan Darah</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.kankerKeluarga.hubunganDarah ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                  {data.kankerKeluarga.hubunganDarah ? 'Ya' : 'Tidak'}
                </span>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-orange-300 text-sm">Siapa Yang Sakit</p>
                <p className="text-white font-semibold">{data.kankerKeluarga.siapaYangSakit || '-'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-orange-300 text-sm">Jenis Kanker</p>
                <p className="text-white font-semibold">{data.kankerKeluarga.kankerApa || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keluhan Pasien */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-6 w-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Keluhan Pasien</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'benjolanDiPayudaraKetiak', label: 'Benjolan di Payudara/Ketiak' },
                { key: 'keluarCairanDariPuting', label: 'Keluar Cairan dari Puting' },
                { key: 'pendarahanSaatSetelahSenggama', label: 'Pendarahan Setelah Senggama' },
                { key: 'sakitNyeriDiPerutBawahPinggul', label: 'Sakit/Nyeri di Perut Bawah/Pinggul' }
              ].map((item) => (
                <div key={item.key} className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-2">{item.label}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.keluhan[item.key] ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {data.keluhan[item.key] ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              ))}
              <div className="md:col-span-2 bg-white/5 rounded-lg p-4">
                <p className="text-purple-300 text-sm">Keluhan Lain-lain</p>
                <p className="text-white font-semibold">{data.keluhan.lainLain || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Input Laboratorium - Redesigned */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <TestTube className="h-6 w-6 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Input Hasil Laboratorium</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Informasi Dasar Lab */}
              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">No Lab</label>
                <input 
                  type="text" 
                  name="noLab" 
                  value={labData.noLab} 
                  onChange={handleChange} 
                  placeholder="LAB-20250619"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Tanggal Pengambilan Sampel</label>
                <input 
                  type="datetime-local" 
                  name="tanggalPengambilanSampel" 
                  value={labData.tanggalPengambilanSampel} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Asal Faskes</label>
                <input 
                  type="text" 
                  name="asalFaskes" 
                  value={labData.asalFaskes} 
                  onChange={handleChange} 
                  placeholder="RSUD Padang"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Tanggal Sampel Diterima</label>
                <input 
                  type="datetime-local" 
                  name="tanggalSampelDiterima" 
                  value={labData.tanggalSampelDiterima} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Tanggal Pemeriksaan</label>
                <input 
                  type="datetime-local" 
                  name="tanggalPemeriksaan" 
                  value={labData.tanggalPemeriksaan} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Jenis Pemeriksaan</label>
                <select 
                  name="jenisPemeriksaan" 
                  value={labData.jenisPemeriksaan} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Jenis Pemeriksaan</option>
                  <option value="HPV DNA Test" className="bg-gray-800">HPV DNA Test</option>
                  <option value="Pap Smear" className="bg-gray-800">Pap Smear</option>
                  <option value="Kolposkopi" className="bg-gray-800">Kolposkopi</option>
                </select>
              </div>

              {/* Sub Type HPV */}
              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Sub Type 16</label>
                <select 
                  name="subType16" 
                  value={labData.subType16} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Hasil</option>
                  <option value="Positif" className="bg-gray-800">Positif</option>
                  <option value="Negatif" className="bg-gray-800">Negatif</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Sub Type 52</label>
                <select 
                  name="subType52" 
                  value={labData.subType52} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Hasil</option>
                  <option value="Positif" className="bg-gray-800">Positif</option>
                  <option value="Negatif" className="bg-gray-800">Negatif</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Sub Type Lainnya</label>
                <input 
                  type="text" 
                  name="subTypeLainnya" 
                  value={labData.subTypeLainnya} 
                  onChange={handleChange} 
                  placeholder="Masukkan sub type lainnya"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Nilai Normal</label>
                <select 
                  name="nilaiNormal" 
                  value={labData.nilaiNormal} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Status</option>
                  <option value="Normal" className="bg-gray-800">Normal</option>
                  <option value="Abnormal" className="bg-gray-800">Abnormal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">Metode Pemeriksaan</label>
                <select 
                  name="metodePemeriksaan" 
                  value={labData.metodePemeriksaan} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Metode</option>
                  <option value="PCR" className="bg-gray-800">PCR</option>
                  <option value="HC2" className="bg-gray-800">HC2</option>
                  <option value="ELISA" className="bg-gray-800">ELISA</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">IVA Test</label>
                <select 
                  name="ivaTest" 
                  value={labData.ivaTest} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Hasil</option>
                  <option value="Positif" className="bg-gray-800">Positif</option>
                  <option value="Negatif" className="bg-gray-800">Negatif</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-cyan-300 text-sm font-medium">SADANIS</label>
                <select 
                  name="sadanis" 
                  value={labData.sadanis} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="" className="bg-gray-800">Pilih Hasil</option>
                  <option value="Positif" className="bg-gray-800">Positif</option>
                  <option value="Negatif" className="bg-gray-800">Negatif</option>
                </select>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSubmitLab} 
                disabled={isSubmitting}
                className={`px-8 py-4 ${
                  isSubmitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105'
                } text-white font-semibold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-400/50`}
              >
                <div className="flex items-center space-x-2">
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <TestTube className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Hasil Lab'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-start px-6 pb-8">
        <Link to="/listPasien" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200">
          Kembali ke Daftar Pasien
        </Link>
      </div>
    </div>
  );
};

export default PeriksaPasien;