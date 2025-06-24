import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiwayatIdentitasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menikahKeKlien, setMenikahKeKlien] = useState('');
  const [menikahKeSuami, setMenikahKeSuami] = useState('');

  // Load data dari localStorage jika tersedia
  const savedData = JSON.parse(localStorage.getItem(`riwayatIdentitas-${id}`));

  const [formData, setFormData] = useState({
    identitasPasienId: parseInt(id),
    statusKawinKlien: savedData?.statusKawinKlien || '',
    statusKawinSuami: savedData?.statusKawinSuami || '',
    pendidikanKlien: savedData?.pendidikanKlien || '',
    pekerjaanKlien: savedData?.pekerjaanKlien || '',
    pekerjaanSuami: savedData?.pekerjaanSuami || '',
  });

  // Cek apakah data identitas pasien tersedia
  useEffect(() => {
    const identitasData = localStorage.getItem('identitasPasien');
    if (!identitasData) {
      toast.error('Anda harus mengisi data identitas pasien terlebih dahulu.', {
        autoClose: 3000,
        onClose: () => navigate('/')
      });
    }
  }, [navigate]);

  // Update data saat komponen dimuat
  useEffect(() => {
    if (savedData) {
      setFormData(savedData);
      if (savedData.statusKawinKlien?.startsWith('Menikah ke')) {
        setMenikahKeKlien(savedData.statusKawinKlien.replace('Menikah ke ', ''));
      }
      if (savedData.statusKawinSuami?.startsWith('Menikah ke')) {
        setMenikahKeSuami(savedData.statusKawinSuami.replace('Menikah ke ', ''));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "statusKawinKlien") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value !== "Menikah ke ...") setMenikahKeKlien("");
    } else if (name === "statusKawinSuami") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value !== "Menikah ke ...") setMenikahKeSuami("");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusKawinKlienFinal =
      formData.statusKawinKlien === "Menikah ke ..."
        ? `Menikah ke ${menikahKeKlien}`
        : formData.statusKawinKlien;
    const statusKawinSuamiFinal =
      formData.statusKawinSuami === "Menikah ke ..."
        ? `Menikah ke ${menikahKeSuami}`
        : formData.statusKawinSuami;

    const finalData = {
      ...formData,
      statusKawinKlien: statusKawinKlienFinal,
      statusKawinSuami: statusKawinSuamiFinal,
    };

    // Simpan ke localStorage
    localStorage.setItem(`riwayatIdentitas-${id}`, JSON.stringify(finalData));

    // Navigasi ke form ketiga
    navigate(`/riwayatReproduksi/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Riwayat Identitas Pasien
            </h1>
            <p className="text-white/80 text-lg">
              Silakan lengkapi informasi tambahan pasien
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20">
          {/* ID Pasien (Readonly) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#410445]">ID Pasien</label>
            <input
              type="number"
              name="identitasPasienId"
              value={formData.identitasPasienId}
              readOnly
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
            />
          </div>

          {/* Status Kawin */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#FF2DF1] to-[#A5158C] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Status Perkawinan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Status Kawin Klien</label>
                <select
                  name="statusKawinKlien"
                  value={formData.statusKawinKlien}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="Belum/belum hub. sex">Belum</option>
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah ke ...">Menikah ke ...</option>
                  <option value="Janda">Janda</option>
                  <option value="Duda">Duda</option>
                </select>
                {formData.statusKawinKlien === "Menikah ke ..." && (
                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-[#410445]">Menikah ke-</label>
                    <input
                      type="number"
                      min="1"
                      value={menikahKeKlien}
                      onChange={(e) => setMenikahKeKlien(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Status Kawin Suami</label>
                <select
                  name="statusKawinSuami"
                  value={formData.statusKawinSuami}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                >
                  <option value="">Pilih Status</option>
                  <option value="Menikah Sekali">Menikah sekali</option>
                  <option value="Menikah ke ...">Menikah ke ...</option>
                </select>
                {formData.statusKawinSuami === "Menikah ke ..." && (
                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-[#410445]">Menikah ke-</label>
                    <input
                      type="number"
                      min="1"
                      value={menikahKeSuami}
                      onChange={(e) => setMenikahKeSuami(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pendidikan & Pekerjaan */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#A5158C] to-[#F6DC43] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Pendidikan & Pekerjaan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Pendidikan Klien</label>
                <select
                  name="pendidikanKlien"
                  value={formData.pendidikanKlien}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Pekerjaan Klien</label>
                <input
                  type="text"
                  name="pekerjaanKlien"
                  value={formData.pekerjaanKlien}
                  onChange={handleChange}
                  placeholder="Contoh: Wiraswasta"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  required
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-[#410445]">Pekerjaan Suami (opsional)</label>
                <input
                  type="text"
                  name="pekerjaanSuami"
                  value={formData.pekerjaanSuami}
                  onChange={handleChange}
                  placeholder="Contoh: PNS"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Identitas
              </span>
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] hover:from-[#F6DC43] hover:to-[#FF2DF1] text-white hover:text-[#410445] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Riwayat
              </span>
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RiwayatIdentitasForm;