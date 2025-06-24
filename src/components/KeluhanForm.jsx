import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const KeluhanForm = () => {
  const { id: identitasPasienId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    benjolanDiPayudaraKetiak: false,
    keluarCairanDariPuting: false,
    keluarBanyakCairanDariKemaluan: false,
    pendarahanSaatSetelahSenggama: false,
    pendarahanDiluarMasaHaid: false,
    sakitNyeriDiPerutBawahPinggul: false,
    lainLain: '',
  });

  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'lainLain') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      const newValue = value === 'true';
      setFormData((prev) => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleSaveToLocalStorage = () => {
    // Simpan ke localStorage
    localStorage.setItem(`keluhan-${identitasPasienId}`, JSON.stringify(formData));
    // Tampilkan tombol aksi
    setShowConfirmButtons(true);
  };

  const handleSubmitAllData = async () => {
    setIsSubmitting(true);

    try {
      // Ambil semua data dari localStorage
      const identitasPasien = JSON.parse(localStorage.getItem('identitasPasien'));
      const riwayatIdentitas = JSON.parse(localStorage.getItem(`riwayatIdentitas-${identitasPasienId}`));
      const riwayatReproduksi = JSON.parse(localStorage.getItem(`riwayatReproduksi-${identitasPasienId}`));
      const riwayatKanker = JSON.parse(localStorage.getItem(`riwayatKanker-${identitasPasienId}`));
      const keluhan = JSON.parse(localStorage.getItem(`keluhan-${identitasPasienId}`));

      // Validasi semua data tersedia
      if (!identitasPasien || !riwayatIdentitas || !riwayatReproduksi || !riwayatKanker || !keluhan) {
        toast.error('Data belum lengkap. Pastikan semua form telah diisi.', {
          autoClose: 4000,
        });
        return;
      }


      await fetch('http://localhost:3000/api/riwayat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riwayatIdentitas),
      });

      await fetch('http://localhost:3000/api/riwayat-reproduksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riwayatReproduksi),
      });

      await fetch('http://localhost:3000/api/kanker-keluarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riwayatKanker),
      });

      const keluhanPayload = {
  ...keluhan,
  identitasPasienId: parseInt(identitasPasienId),
};

// Hapus 'lainLain' jika kosong string
if (keluhanPayload.lainLain === '') {
  delete keluhanPayload.lainLain;
}

await fetch('http://localhost:3000/api/keluhan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(keluhanPayload),
});

      // Hapus semua data lokal
      localStorage.removeItem('identitasPasien');
      localStorage.removeItem(`riwayatIdentitas-${identitasPasienId}`);
      localStorage.removeItem(`riwayatReproduksi-${identitasPasienId}`);
      localStorage.removeItem(`riwayatKanker-${identitasPasienId}`);
      localStorage.removeItem(`keluhan-${identitasPasienId}`);

      // Navigasi ke halaman sukses
      toast.success('Semua data berhasil dikirim!', {
        autoClose: 3000,
        onClose: () => navigate('/'),
      });

    } catch (error) {
      console.error('Gagal mengirim data:', error);
      let errorMessage = 'Gagal mengirim data ke server.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Tidak ada respon dari server.';
      } else {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Keluhan Pasien</h1>
            <p className="text-white/80 text-lg">Silakan lengkapi informasi keluhan pasien</p>
          </div>
        </div>

        {/* Form Container */}
        <form className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 space-y-8">

          {/* ID Pasien (Readonly) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#410445]">ID Pasien</label>
            <input
              type="number"
              readOnly
              value={identitasPasienId}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
            />
          </div>

          {/* Section Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-[#FF2DF1] to-[#A5158C] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Keluhan Fisik Pasien</h2>
            </div>
            <p className="text-gray-700 mb-6">Silakan centang "Ya" jika pasien mengalami keluhan berikut:</p>
          </div>

          {/* Keluhan List */}
          {[
            {
              label: 'Adakah benjolan di payudara atau ketiak?',
              name: 'benjolanDiPayudaraKetiak'
            },
            {
              label: 'Apakah ada keluar cairan dari putting?',
              name: 'keluarCairanDariPuting'
            },
            {
              label: 'Keluar banyak cairan dari kemaluan?',
              name: 'keluarBanyakCairanDariKemaluan'
            },
            {
              label: 'Pendarahan saat atau setelah senggama?',
              name: 'pendarahanSaatSetelahSenggama'
            },
            {
              label: 'Pendarahan di luar masa haid?',
              name: 'pendarahanDiluarMasaHaid'
            },
            {
              label: 'Sakit nyeri di perut bawah atau pinggul?',
              name: 'sakitNyeriDiPerutBawahPinggul'
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className="block text-sm font-semibold text-[#410445] md:w-2/3">
                {item.label}
              </label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={item.name}
                    value="true"
                    checked={formData[item.name] === true}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#FF2DF1]"
                  />
                  <span className="ml-2 text-gray-700">Ya</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={item.name}
                    value="false"
                    checked={formData[item.name] === false}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#FF2DF1]"
                  />
                  <span className="ml-2 text-gray-700">Tidak</span>
                </label>
              </div>
            </div>
          ))}

          {/* Lain-lain */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#410445] mb-2">Lain-lain (opsional)</label>
          <textarea
  name="lainLain"
  value={formData.lainLain || ''}
  onChange={(e) => setFormData(prev => ({ ...prev, lainLain: e.target.value }))}
  rows="3"
  placeholder="Sebutkan keluhan tambahan..."
  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-[#FF2DF1] focus:ring-opacity-20 transition-all duration-300 outline-none"
></textarea>

          </div>

          {/* Action Buttons */}
          {!showConfirmButtons ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveToLocalStorage}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] hover:from-[#F6DC43] hover:to-[#FF2DF1] text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan dan Periksa
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6 border-t border-gray-200">
              {/* Tombol Kembali */}
              <button
                type="button"
                onClick={() => navigate(`/riwayatKankerDalamKeluarga/${identitasPasienId}`)}
                className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </span>
              </button>

              {/* Tombol Kirim Semua Data */}
              <button
                type="button"
                onClick={handleSubmitAllData}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] hover:from-[#F6DC43] hover:to-[#FF2DF1] text-white hover:text-[#410445] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kirim Semua Data
                  </span>
                )}
              </button>
            </div>
          )}

        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default KeluhanForm;