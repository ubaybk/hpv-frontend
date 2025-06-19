import React, { useState } from 'react';
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
    kankerApa: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle radio buttons
    if (type === 'radio') {
      const boolValue = value === 'true';
      setFormData(prev => ({
        ...prev,
        [name]: boolValue
      }));
      return;
    }

    // Handle "TIDAK TAHU" selection
    if (name === 'kankerApa' && value === 'TIDAK TAHU') {
      setFormData(prev => ({
        ...prev,
        kankerApa: 'TIDAK TAHU'
      }));
      return;
    }

    // Handle "Lainnya" selection
    if (name === 'kankerApa' && value === 'Lainnya') {
      setFormData(prev => ({
        ...prev,
        kankerApa: ''
      }));
      return;
    }

    // Handle regular inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const payload = {
        identitasPasienId: formData.identitasPasienId,
        tumorJinakPayudara: formData.tumorJinakPayudara,
        hubunganDarah: formData.hubunganDarah,
        ...(formData.hubunganDarah && {
          siapaYangSakit: formData.siapaYangSakit,
          kankerApa: formData.kankerApa
        })
      };

      const response = await fetch('http://localhost:3000/api/kanker-keluarga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan data riwayat kanker keluarga');
      }

      toast.success('Data riwayat kanker keluarga berhasil disimpan!', {
        autoClose: 3000,
        onClose: () => navigate(`/keluhanForm/${id}`),
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Terjadi kesalahan. Silakan coba lagi', {
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#410445]">Riwayat Kanker dalam Keluarga</h2>

      {/* ID Pasien */}
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

      {/* Tumor Jinak Payudara */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Apakah Anda pernah mengalami tumor jinak payudara?
        </label>
        <div className="flex items-center mt-2 space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tumorJinakPayudara"
              value="true"
              checked={formData.tumorJinakPayudara === true}
              onChange={handleChange}
              className="h-5 w-5 text-pink-600"
            />
            <span className="ml-2 text-gray-700">Ya</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tumorJinakPayudara"
              value="false"
              checked={formData.tumorJinakPayudara === false}
              onChange={handleChange}
              className="h-5 w-5 text-pink-600"
            />
            <span className="ml-2 text-gray-700">Tidak</span>
          </label>
        </div>
      </div>

      {/* Hubungan Darah */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Apakah ada anggota keluarga yang memiliki riwayat kanker?
        </label>
        <div className="flex items-center mt-2 space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hubunganDarah"
              value="true"
              checked={formData.hubunganDarah === true}
              onChange={handleChange}
              className="h-5 w-5 text-pink-600"
            />
            <span className="ml-2 text-gray-700">Ya</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hubunganDarah"
              value="false"
              checked={formData.hubunganDarah === false}
              onChange={handleChange}
              className="h-5 w-5 text-pink-600"
            />
            <span className="ml-2 text-gray-700">Tidak</span>
          </label>
        </div>
      </div>

      {/* Conditional fields for hubunganDarah = true */}
      {formData.hubunganDarah && (
        <>
          {/* Siapa Yang Sakit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Siapa yang mengalami kanker?
            </label>
            <input
              type="text"
              name="siapaYangSakit"
              value={formData.siapaYangSakit}
              onChange={handleChange}
              placeholder="Contoh: Ibu, Saudara"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Jenis Kanker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Jenis Kanker
            </label>
            <select
              name="kankerApa"
              value={formData.kankerApa}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Pilih Jenis Kanker</option>
              <option value="Kanker Payudara">Kanker Payudara</option>
              <option value="Kanker Serviks">Kanker Serviks</option>
              <option value="Kanker Ovarium">Kanker Ovarium</option>
              <option value="TIDAK TAHU">TIDAK TAHU</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {/* Custom input for "Lainnya" */}
            {formData.kankerApa === 'Lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="kankerApaCustom"
                  placeholder="Sebutkan jenis kanker..."
                  value={formData.kankerApa}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    kankerApa: e.target.value 
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FF2DF1] hover:bg-[#F6DC43] text-black font-bold py-2 px-6 rounded transition duration-300 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : 'Simpan Riwayat'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default RiwayatKankerDalamKeluargaForm;