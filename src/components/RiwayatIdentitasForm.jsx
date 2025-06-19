import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiwayatIdentitasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menikahKeKlien, setMenikahKeKlien] = useState("");
  const [menikahKeSuami, setMenikahKeSuami] = useState("");

  const [formData, setFormData] = useState({
    identitasPasienId: parseInt(id),
    statusKawinKlien: '',
    statusKawinSuami: '',
    pendidikanKlien: '',
    pekerjaanKlien: '',
    pekerjaanSuami: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "statusKawinKlien") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      
      // Reset nilai menikahKeKlien jika tidak memilih "Menikah ke ..."
      if (value !== "Menikah ke ...") {
        setMenikahKeKlien("");
      }
    } 
    else if (name === "statusKawinSuami") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      
      // Reset nilai menikahKeSuami jika tidak memilih "Menikah ke ..."
      if (value !== "Menikah ke ...") {
        setMenikahKeSuami("");
      }
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Format status kawin klien jika memilih "Menikah ke ..."
  const statusKawinKlienFinal = formData.statusKawinKlien === "Menikah ke ..." 
    ? `Menikah ke ${menikahKeKlien}`
    : formData.statusKawinKlien;

  // Format status kawin suami jika memilih "Menikah ke ..."
  const statusKawinSuamiFinal = formData.statusKawinSuami === "Menikah ke ..." 
    ? `Menikah ke ${menikahKeSuami}`
    : formData.statusKawinSuami;

  try {
    const response = await fetch('http://localhost:3000/api/riwayat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        statusKawinKlien: statusKawinKlienFinal,
        statusKawinSuami: statusKawinSuamiFinal
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.error === 'ID Pasien sudah terdaftar') {
        toast.error('ID Pasien sudah ada!', {
          autoClose: 3000,
          onClose: () => navigate('/'),
        });
      } else {
        toast.error('Gagal menyimpan riwayat.', {
          autoClose: 3000,
        });
      }
      return;
    }

    toast.success('Riwayat berhasil disimpan!', {
      autoClose: 3000,
      onClose: () => navigate(`/riwayatReproduksi/${id}`), // ✅ Redirect dengan ID dinamis
    });

  } catch (error) {
    console.error('Network error:', error);
    toast.error('Terjadi kesalahan jaringan.', {
      autoClose: 5000,
    });
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#410445]">Isi Riwayat Identitas</h2>

      {/* ID Pasien (readonly) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID Pasien</label>
        <input
          type="number"
          name="identitasPasienId"
          value={formData.identitasPasienId}
          readOnly
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
        />
      </div>

      {/* Status Kawin Klien & Suami */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status Kawin Klien</label>
          <select
            name="statusKawinKlien"
            value={formData.statusKawinKlien}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Pilih Status</option>
            <option value="Belum/belum hub. sex">Belum</option>
            <option value="Belum Menikah">Belum Menikah</option>
            <option value="Menikah ke ...">Menikah ke ...</option>
            <option value="Janda">Janda</option>
            <option value="Duda">Duda</option>
          </select>

          {/* Input tambahan untuk "Menikah ke ..." Klien */}
          {formData.statusKawinKlien === "Menikah ke ..." && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Menikah ke-</label>
              <input
                type="number"
                min="1"
                value={menikahKeKlien}
                onChange={(e) => setMenikahKeKlien(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status Kawin Suami</label>
          <select
            name="statusKawinSuami"
            value={formData.statusKawinSuami}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Pilih Status</option>
            <option value="Menikah Sekali">Menikah sekali</option>
            <option value="Menikah ke ...">Menikah ke ...</option>
            
          </select>

          {/* Input tambahan untuk "Menikah ke ..." Suami */}
          {formData.statusKawinSuami === "Menikah ke ..." && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Menikah ke-</label>
              <input
                type="number"
                min="1"
                value={menikahKeSuami}
                onChange={(e) => setMenikahKeSuami(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          )}
        </div>
      </div>

      {/* Pendidikan & Pekerjaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pendidikan Klien</label>
          <select
            name="pendidikanKlien"
            value={formData.pendidikanKlien}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Pilih Pendidikan</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="Diploma">Diploma</option>
            <option value="Sarjana">Sarjana</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pekerjaan Klien</label>
          <input
            type="text"
            name="pekerjaanKlien"
            value={formData.pekerjaanKlien}
            onChange={handleChange}
            placeholder="Contoh: Wiraswasta"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      </div>

      {/* Pekerjaan Suami */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Pekerjaan Suami (opsional)</label>
        <input
          type="text"
          name="pekerjaanSuami"
          value={formData.pekerjaanSuami}
          onChange={handleChange}
          placeholder="Contoh: PNS"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#FF2DF1] hover:bg-[#F6DC43] text-black font-bold py-2 px-6 rounded transition duration-300"
        >
          Simpan Riwayat
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default RiwayatIdentitasForm;