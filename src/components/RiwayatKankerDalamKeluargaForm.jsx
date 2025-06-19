import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiwayatKankerDalamKeluargaForm = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identitasPasienId: parseInt(id),
    tumorJinakPayudara: false,
    hubunganDarah: false,
    siapaYangSakit: '',
    kankerApa: '', // bisa "TIDAK TAHU" atau custom text
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === 'checkbox' ? checked : value;

    // Jika user pilih "TIDAK TAHU", kosongkan input kankerApa
    if (name === 'kankerApa' && value === 'TIDAK TAHU') {
      setFormData((prev) => ({
        ...prev,
        kankerApa: 'TIDAK TAHU',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const dataToSend = {
    ...formData,
    umurMenopause: formData.masihHaid === 'Tidak' ? parseInt(formData.umurMenopause) : undefined,
  };

  try {
    const response = await fetch('http://localhost:3000/api/riwayat-reproduksi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (!response.ok) {
      toast.error('Gagal menyimpan data riwayat reproduksi.', {
        autoClose: 3000,
      });
      return;
    }

    toast.success('Data riwayat kanker berhasil disimpan!', {
      autoClose: 3000,
      onClose: () => navigate(`/keluhanForm/${id}`), // ✅ Redirect ke /keluhanForm/:id
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Apakah Anda pernah mengalami tumor jinak payudara?</label>
        <div className="flex items-center mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tumorJinakPayudara"
              checked={formData.tumorJinakPayudara === true}
              onChange={() => setFormData((prev) => ({ ...prev, tumorJinakPayudara: true }))}
              className="h-4 w-4 text-pink-600"
            />
            <span className="ml-2">Ya</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tumorJinakPayudara"
              checked={formData.tumorJinakPayudara === false}
              onChange={() => setFormData((prev) => ({ ...prev, tumorJinakPayudara: false }))}
              className="h-4 w-4 text-pink-600"
            />
            <span className="ml-2">Tidak</span>
          </label>
        </div>
      </div>

      {/* Hubungan Darah */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Apakah ada anggota keluarga yang memiliki riwayat kanker?</label>
        <div className="flex items-center mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hubunganDarah"
              checked={formData.hubunganDarah === true}
              onChange={() => setFormData((prev) => ({ ...prev, hubunganDarah: true }))}
              className="h-4 w-4 text-pink-600"
            />
            <span className="ml-2">Ya</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hubunganDarah"
              checked={formData.hubunganDarah === false}
              onChange={() => setFormData((prev) => ({ ...prev, hubunganDarah: false }))}
              className="h-4 w-4 text-pink-600"
            />
            <span className="ml-2">Tidak</span>
          </label>
        </div>
      </div>

      {/* Siapa Yang Sakit (jika hubunganDarah == Ya) */}
      {formData.hubunganDarah && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Siapa yang mengalami kanker?</label>
          <input
            type="text"
            name="siapaYangSakit"
            value={formData.siapaYangSakit}
            onChange={handleChange}
            placeholder="Contoh: Ibu, Saudara"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      )}

      {/* Jenis Kanker */}
      {formData.hubunganDarah && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Jenis Kanker</label>
          <select
            name="kankerApa"
            value={formData.kankerApa}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Pilih Jenis Kanker</option>
            <option value="Kanker Payudara">Kanker Payudara</option>
            <option value="Kanker Serviks">Kanker Serviks</option>
            <option value="Kanker Ovarium">Kanker Ovarium</option>
            <option value="TIDAK TAHU">TIDAK TAHU</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          {/* Input manual jika pilih "Lainnya" */}
          {(formData.kankerApa === 'Lainnya') && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Sebutkan jenis kanker..."
                value={formData.kankerApa !== 'Lainnya' ? '' : ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, kankerApa: e.target.value }))
                }
                className="block w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>
          )}
        </div>
      )}

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

export default RiwayatKankerDalamKeluargaForm;