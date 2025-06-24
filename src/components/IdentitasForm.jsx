import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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

  const [setujuSimpanData, setSetujuSimpanData] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!setujuSimpanData) {
    toast.error('Anda harus menyetujui syarat dan ketentuan.', {
      position: 'top-right',
      autoClose: 3000,
    });
    return;
  }

  const dataToSave = {
    ...formData,
    setujuSimpanData: true,
    beratBadan: parseFloat(formData.beratBadan),
    tinggiBadan: parseInt(formData.tinggiBadan, 10),
    tanggalLahir: new Date(formData.tanggalLahir).toISOString(),
  };

try {
  const response = await axios.post('http://localhost:3000/api/pasien', dataToSave);
  const savedId = response?.data?.id;
  toast.success('Data berhasil disimpan!', {
    position: 'top-right',
    autoClose: 3000,
  });

  localStorage.setItem('identitasPasien', JSON.stringify(dataToSave));
  navigate(`/riwayatIdentitas/${savedId}`);
} catch (error) {
  console.error('Gagal menyimpan data:', error);

  const backendMessage = error?.response?.data?.error || 'Terjadi kesalahan saat menyimpan data.';

  toast.error(
    backendMessage.toLowerCase().includes('nik') && backendMessage.toLowerCase().includes('ada')
      ? 'NIK SUDAH TERDAFTAR'
      : backendMessage,
    {
      position: 'top-right',
      autoClose: 3000,
      onClose: () => {
        if (backendMessage.toLowerCase().includes('nik') && backendMessage.toLowerCase().includes('ada')) {
          navigate('/cekNik');
        }
      },
    }
  );
}


};

useEffect(() => {
  const savedData = localStorage.getItem('identitasPasien');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    setFormData(parsedData);
    setSetujuSimpanData(parsedData.setujuSimpanData || false);
  }
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Data Identitas Pasien
            </h1>
            <p className="text-white/80 text-lg">
              Silakan lengkapi informasi pasien dengan teliti
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20">
          
          {/* Section: Informasi Pribadi */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#FF2DF1] to-[#A5158C] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Informasi Pribadi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">
                  Nama Lengkap <span className="text-[#FF2DF1]">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">NIK <span className="text-[#FF2DF1]">*</span></label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="16 digit NIK"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Suku</label>
                <input
                  type="text"
                  name="suku"
                  value={formData.suku}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Suku bangsa"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Kota tempat lahir"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir.split('T')[0]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Alamat */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#A5158C] to-[#F6DC43] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Alamat Lengkap</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Alamat Jalan</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Jalan, gang, nomor rumah"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#410445]">RT</label>
                  <input
                    type="text"
                    name="rt"
                    value={formData.rt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    placeholder="001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#410445]">RW</label>
                  <input
                    type="text"
                    name="rw"
                    value={formData.rw}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    placeholder="001"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-[#410445]">Kelurahan</label>
                  <input
                    type="text"
                    name="kelurahan"
                    value={formData.kelurahan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    placeholder="Kelurahan"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-[#410445]">Kecamatan</label>
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    placeholder="Kecamatan"
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-semibold text-[#410445]">Kota</label>
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                    placeholder="Kota/Kabupaten"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Provinsi</label>
                <input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Provinsi"
                />
              </div>
            </div>
          </div>

          {/* Section: Data Fisik & Kontak */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#F6DC43] to-[#FF2DF1] rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-[#410445]">Data Fisik & Kontak</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Berat Badan</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    name="beratBadan"
                    value={formData.beratBadan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none pr-12"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A5158C] font-medium">kg</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Tinggi Badan</label>
                <div className="relative">
                  <input
                    type="number"
                    name="tinggiBadan"
                    value={formData.tinggiBadan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A5158C] font-medium">cm</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Golongan Darah</label>
                <input
                  type="text"
                  name="golonganDarah"
                  value={formData.golonganDarah}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="A/B/AB/O"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">No. HP</label>
                <input
                  type="text"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Nama Suami</label>
                <input
                  type="text"
                  name="namaSuami"
                  value={formData.namaSuami}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  placeholder="Nama suami (opsional)"
                />
              </div>
            </div>
          </div>

          {/* Persetujuan Penyimpanan Data */}
          <div className="mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="setujuSimpanData"
                name="setujuSimpanData"
                checked={setujuSimpanData}
                onChange={(e) => setSetujuSimpanData(e.target.checked)}
                required
                className="mt-1 h-5 w-5 text-[#FF2DF1] focus:ring-[#A5158C] rounded border-gray-300"
              />
              <label htmlFor="setujuSimpanData" className="ml-3 text-sm text-orange-500">
                Saya setuju bahwa data rekam medis HPV saya akan disimpan dan digunakan secara aman sesuai{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-[#FF2DF1] underline hover:text-[#A5158C] font-medium"
                >
                  syarat dan ketentuan
                </button>.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              <span className="text-[#FF2DF1]">*</span> Wajib diisi
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] hover:from-[#F6DC43] hover:to-[#FF2DF1] text-white hover:text-[#410445] font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Data
              </span>
            </button>
          </div>
        </form>

        {/* Modal Syarat dan Ketentuan */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-[#410445]">Syarat dan Ketentuan Penyimpanan Data Medis</h3>
              </div>
              <div className="p-6 space-y-4 text-gray-700">
                <p>Dengan menyetujui penyimpanan data rekam medis HPV Anda, kami menyatakan bahwa:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Data akan disimpan secara aman sesuai standar keamanan digital.</li>
                  <li>Data hanya digunakan untuk keperluan layanan kesehatan pasien terkait.</li>
                  <li>Pasien berhak mengakses atau meminta hapus data sesuai permintaan resmi.</li>
                  <li>Data tidak akan dibagikan kepada pihak ketiga tanpa izin eksplisit pasien.</li>
                </ul>
                <p>Harap baca dan pahami informasi di atas. Centang kotak persetujuan jika Anda menyetujui.</p>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2 bg-gradient-to-r from-[#FF2DF1] to-[#A5158C] text-white font-semibold rounded-xl hover:opacity-90 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default IdentitasForm;