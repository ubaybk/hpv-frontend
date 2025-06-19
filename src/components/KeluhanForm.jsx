import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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

 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'lainLain') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      const newValue = value === 'true';
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: newValue };

        // Cek apakah ada jawaban Ya
        const isAnyYes = Object.values(updatedData).some(
          (val) => typeof val === 'boolean' && val === true
        );

       

        return updatedData;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        identitasPasienId: parseInt(identitasPasienId),
        lainLain: formData.lainLain.trim() === '' ? '-' : formData.lainLain.trim(),
      };

      await axios.post('http://localhost:3000/api/keluhan', payload);

      toast.success('Data keluhan berhasil disimpan!', {
        autoClose: 2000,
        position: 'top-right',
        onClose: () => navigate('/'),
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal menyimpan data. Silakan coba lagi.', {
        autoClose: 3000,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Keluhan Pasien</h1>
      <p className="text-sm text-gray-600 mb-6">ID Pasien: <strong>{identitasPasienId}</strong></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Benjolan Di Payudara / Ketiak */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Adakah benjolan di payudara atau ketiak?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="benjolanDiPayudaraKetiak" value="true" checked={formData.benjolanDiPayudaraKetiak === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="benjolanDiPayudaraKetiak" value="false" checked={formData.benjolanDiPayudaraKetiak === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Keluar Cairan Dari Puting */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Apakah ada keluar cairan dari putting?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="keluarCairanDariPuting" value="true" checked={formData.keluarCairanDariPuting === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="keluarCairanDariPuting" value="false" checked={formData.keluarCairanDariPuting === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Keluar Banyak Cairan Dari Kemaluan */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Keluar banyak cairan dari kemaluan?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="keluarBanyakCairanDariKemaluan" value="true" checked={formData.keluarBanyakCairanDariKemaluan === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="keluarBanyakCairanDariKemaluan" value="false" checked={formData.keluarBanyakCairanDariKemaluan === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Pendarahan Saat Setelah Senggama */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Pendarahan saat atau setelah senggama?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="pendarahanSaatSetelahSenggama" value="true" checked={formData.pendarahanSaatSetelahSenggama === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="pendarahanSaatSetelahSenggama" value="false" checked={formData.pendarahanSaatSetelahSenggama === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Pendarahan di luar masa haid */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Pendarahan di luar masa haid?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="pendarahanDiluarMasaHaid" value="true" checked={formData.pendarahanDiluarMasaHaid === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="pendarahanDiluarMasaHaid" value="false" checked={formData.pendarahanDiluarMasaHaid === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Sakit Nyeri di Perut Bawah / Pinggul */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 w-2/3">
            Sakit nyeri di perut bawah atau pinggul?
          </label>
          <div className="flex space-x-4">
            <label><input type="radio" name="sakitNyeriDiPerutBawahPinggul" value="true" checked={formData.sakitNyeriDiPerutBawahPinggul === true} onChange={handleChange} /> Ya</label>
            <label><input type="radio" name="sakitNyeriDiPerutBawahPinggul" value="false" checked={formData.sakitNyeriDiPerutBawahPinggul === false} onChange={handleChange} /> Tidak</label>
          </div>
        </div>

        {/* Lain-lain - hanya muncul jika ada jawaban "Ya" */}
        
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lain-lain (opsional)
            </label>
            <textarea
              name="lainLain"
              value={formData.lainLain || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Sebutkan keluhan lain..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-[#FF2DF1] hover:bg-[#F6DC43] text-black font-semibold rounded-md focus:outline-none ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </>
            ) : 'Simpan Keluhan'}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default KeluhanForm;