import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiwayatKankerDalamKeluargaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identitasPasienId: parseInt(id),
    tumorJinakPayudara: false,
    hubunganDarah: false,
    siapaYangSakit: '',
    kankerApaSelect: '', // hanya bisa TIDAK TAHU atau KANKER
    kankerApa: '', // akan diisi jika kankerApaSelect === 'KANKER'
  });

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dataToSave = { ...formData };

// Hapus siapaYangSakit dan kankerApa jika tidak relevan
if (!dataToSave.hubunganDarah) {
  delete dataToSave.siapaYangSakit;
  delete dataToSave.kankerApa;
  delete dataToSave.kankerApaSelect;
}


  // Load data dari localStorage jika tersedia
  useEffect(() => {
    const savedData = localStorage.getItem(`riwayatKanker-${id}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      setShowCustomInput(parsedData.kankerApaSelect === 'KANKER');
    }

    // Cek apakah user sudah menyelesaikan form pertama
    const identitasData = localStorage.getItem('identitasPasien');
    if (!identitasData) {
      toast.error('Anda harus mengisi data identitas pasien terlebih dahulu.', {
        autoClose: 3000,
        onClose: () => navigate('/')
      });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Radio button (boolean)
    if (type === 'radio') {
      const boolValue = value === 'true';
      setFormData((prev) => ({
        ...prev,
        [name]: boolValue
      }));
      return;
    }

    // Dropdown jenis kanker
    if (name === 'kankerApaSelect') {
      if (value === 'TIDAK TAHU') {
        setFormData((prev) => ({
          ...prev,
          kankerApaSelect: value,
          kankerApa: 'TIDAK TAHU',
        }));
        setShowCustomInput(false);
      } else if (value === 'KANKER') {
        setFormData((prev) => ({
          ...prev,
          kankerApaSelect: value,
          kankerApa: prev.kankerApa || '', // biarkan nilai lama jika ada
        }));
        setShowCustomInput(true);
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        setShowCustomInput(false);
      }
      return;
    }

    // Input manual jenis kanker
    if (name === 'kankerApa') {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
      return;
    }

    // Input lainnya
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Ambil data penting dari form
  let {
    identitasPasienId,
    tumorJinakPayudara,
    hubunganDarah,
    siapaYangSakit,
    kankerApa,
    kankerApaSelect,
  } = formData;

  // Jika tidak ada hubungan darah, kosongkan
  if (!hubunganDarah) {
    siapaYangSakit = undefined;
    kankerApa = undefined;
  } else {
    if (kankerApaSelect === 'TIDAK TAHU') {
      kankerApa = 'TIDAK TAHU';
    } else if (kankerApaSelect === 'KANKER' && kankerApa.trim() !== '') {
      kankerApa = `KANKER - ${kankerApa}`;
    } else {
      kankerApa = '';
    }
  }

  // Siapkan object yang akan disimpan (tanpa kankerApaSelect)
  const dataToSave = {
    identitasPasienId,
    tumorJinakPayudara,
    hubunganDarah,
    siapaYangSakit,
    kankerApa,
  };

  // Simpan ke localStorage
  localStorage.setItem(`riwayatKanker-${id}`, JSON.stringify(dataToSave));

  // Navigasi ke halaman berikutnya
  setTimeout(() => {
    setIsSubmitting(false);
    navigate(`/keluhanForm/${id}`);
  }, 800);
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Riwayat Kanker dalam Keluarga
            </h1>
            <p className="text-white/80 text-lg">
              Silakan lengkapi riwayat kanker dalam keluarga pasien
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 space-y-8">
          
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

          {/* Tumor Jinak Payudara */}
          <div className="mb-6">
            <label className="block text-xl font-semibold text-[#410445] mb-4">
              Apakah Anda pernah mengalami tumor jinak pada payudara?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tumorJinakPayudara"
                  value="true"
                  checked={formData.tumorJinakPayudara === true || formData.tumorJinakPayudara === 'Ya'}
                  onChange={() => setFormData(prev => ({ ...prev, tumorJinakPayudara: true }))}
                  className="w-5 h-5 accent-[#FF2DF1]"
                />
                <span>Ya</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tumorJinakPayudara"
                  value="false"
                  checked={formData.tumorJinakPayudara === false || formData.tumorJinakPayudara === 'Tidak'}
                  onChange={() => setFormData(prev => ({ ...prev, tumorJinakPayudara: false }))}
                  className="w-5 h-5 accent-[#FF2DF1]"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>

          {/* Hubungan Darah */}
          <div className="mb-6">
            <label className="block text-xl font-semibold text-[#410445] mb-4">
              Apakah ada anggota keluarga darah yang menderita kanker?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="hubunganDarah"
                  value="true"
                  checked={formData.hubunganDarah === true || formData.hubunganDarah === 'Ya'}
                  onChange={() => setFormData(prev => ({ ...prev, hubunganDarah: true }))}
                  className="w-5 h-5 accent-[#FF2DF1]"
                />
                <span>Ya</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="hubunganDarah"
                  value="false"
                  checked={formData.hubunganDarah === false || formData.hubunganDarah === 'Tidak'}
                  onChange={() => setFormData(prev => ({ ...prev, hubunganDarah: false }))}
                  className="w-5 h-5 accent-[#FF2DF1]"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>

          {/* Siapa Yang Sakit (Text Input) */}
          {formData.hubunganDarah && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#410445]">
                Siapa yang sakit? (Contoh: Ibu, Saudara)
              </label>
              <input
                type="text"
                name="siapaYangSakit"
                value={formData.siapaYangSakit}
                onChange={handleChange}
                placeholder="Contoh: Ibu, Saudara, dll."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                required
              />
            </div>
          )}

          {/* Jenis Kanker (Dropdown + Custom Input) */}
          {formData.hubunganDarah && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#410445]">Jenis Kanker</label>
              <select
                name="kankerApaSelect"
                value={formData.kankerApaSelect}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                required
              >
                <option value="">Pilih Jawaban</option>
                <option value="TIDAK TAHU">TIDAK TAHU</option>
                <option value="KANKER">KANKER</option>
              </select>

              {/* Input jika memilih "KANKER" */}
              {showCustomInput && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-[#410445]">
                    Sebutkan jenis kanker:
                  </label>
                  <input
                    type="text"
                    name="kankerApa"
                    value={formData.kankerApa}
                    onChange={handleChange}
                    placeholder="Contoh: Payudara, Serviks"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6 border-t border-gray-200">
            {/* Tombol Kembali */}
            <button
              type="button"
              onClick={() => navigate(`/riwayatReproduksi/${id}`)}
              className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Riwayat Reproduksi
              </span>
            </button>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] hover:from-[#F6DC43] hover:to-[#FF2DF1] text-white hover:text-[#410445] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4 4m0 0l4-4m-4 4V8"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Riwayat
                </span>
              )}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RiwayatKankerDalamKeluargaForm;