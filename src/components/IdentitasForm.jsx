import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IdentitasForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    suku: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    beratBadan: '',
    tinggiBadan: '',
    golonganDarah: '',
    noHp: '',
    namaSuami: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      beratBadan: parseFloat(formData.beratBadan),
      tinggiBadan: parseInt(formData.tinggiBadan, 10),
      tanggalLahir: new Date(formData.tanggalLahir).toISOString(),
    };

    try {
      const response = await fetch('http://localhost:3000/api/pasien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'NIK sudah ada') {
          toast.error('NIK sudah terdaftar!', {
            position: 'top-right',
            autoClose: 3000,
            onClose: () => navigate('/'),
          });
        } else {
          toast.error('Gagal menyimpan data.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
        return;
      }

      // Ambil ID dari respons backend
      const pasienId = result.id || result.identitasPasienId;

      toast.success('Data pasien berhasil disimpan!', {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => navigate(`/riwayatIdentitas/${pasienId}`),
      });

    } catch (error) {
      console.error('Network error:', error);
      toast.error('Terjadi kesalahan jaringan.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#410445]">Isi Data Identitas Pasien</h2>

      {/* Nama & Suku & NIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Suku</label>
          <input
            type="text"
            name="suku"
            value={formData.suku}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIK</label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      </div>

      {/* Tempat Lahir & Tanggal Lahir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
          <input
            type="text"
            name="tempatLahir"
            value={formData.tempatLahir}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir.split('T')[0]}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Alamat */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <input
          type="text"
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* RT / RW */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">RT</label>
          <input
            type="text"
            name="rt"
            value={formData.rt}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">RW</label>
          <input
            type="text"
            name="rw"
            value={formData.rw}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Kelurahan - Provinsi */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Kelurahan</label>
          <input
            type="text"
            name="kelurahan"
            value={formData.kelurahan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
          <input
            type="text"
            name="kecamatan"
            value={formData.kecamatan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kota</label>
          <input
            type="text"
            name="kota"
            value={formData.kota}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Provinsi</label>
          <input
            type="text"
            name="provinsi"
            value={formData.provinsi}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Berat Badan & Tinggi Badan & Golongan Darah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
          <input
            type="number"
            step="0.1"
            name="beratBadan"
            value={formData.beratBadan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
          <input
            type="number"
            name="tinggiBadan"
            value={formData.tinggiBadan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
          <input
            type="text"
            name="golonganDarah"
            value={formData.golonganDarah}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* No HP & Nama Suami */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">No HP</label>
          <input
            type="text"
            name="noHp"
            value={formData.noHp}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Suami</label>
          <input
            type="text"
            name="namaSuami"
            value={formData.namaSuami}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#FF2DF1] hover:bg-[#F6DC43] text-black font-bold py-2 px-6 rounded transition duration-300"
        >
          Simpan Data
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default IdentitasForm;