import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RiwayatKesehatanReproduksiForm = () => {
  const { id: identitasPasienId } = useParams();
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      masihHaid: 'Ya',
      pernahMenyusui: 'Tidak',
      konsumsiAlkohol: 'tidak',
      papSmear: 'tidak',
      tesIVA: 'tidak',
      kurangAktifitas: 'tidak',
      kurangKonsumsiBuah: 'tidak',
      merokok: 'tidak'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);

  // Watch form values
  const masihHaid = watch("masihHaid");
  const pernahMenyusui = watch("pernahMenyusui");
  const riwayatKBLama = watch("riwayatKBLama");
  const riwayatKBBaru = watch("riwayatKBBaru");
  const merokok = watch("merokok");

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/riwayat-reproduksi?identitasPasienId=${identitasPasienId}`
        );
        if (response.data) {
          setExistingData(response.data);
          // Set form values from existing data
          Object.keys(response.data).forEach(key => {
            // Convert boolean values to 'ya'/'tidak'
            if (typeof response.data[key] === 'boolean') {
              setValue(key, response.data[key] ? 'ya' : 'tidak');
            } else {
              setValue(key, response.data[key]);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (identitasPasienId) fetchData();
    else setIsLoading(false);
  }, [identitasPasienId, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Transform data before sending
      const transformNumber = (value) => {
        if (value === "" || value === undefined || value === null) return null;
        const num = parseInt(value);
        return isNaN(num) ? null : num;
      };

      // Base payload
      const payload = {
        identitasPasienId: parseInt(identitasPasienId),
        usiaPertamaHaid: transformNumber(data.usiaPertamaHaid),
        usiaPertamaKawin: transformNumber(data.usiaPertamaKawin),
        usiaPertamaHamil: transformNumber(data.usiaPertamaHamil),
        konsumsiAlkohol: data.konsumsiAlkohol === 'ya',
        masihHaid: data.masihHaid,
        jumlahMelahirkanNormal: transformNumber(data.jumlahMelahirkanNormal) || 0,
        jumlahMelahirkanCaesar: transformNumber(data.jumlahMelahirkanCaesar) || 0,
        jumlahKeguguran: transformNumber(data.jumlahKeguguran) || 0,
        pernahMenyusui: data.pernahMenyusui,
        riwayatKBLama: data.riwayatKBLama || 'tidak pernah',
        riwayatKBBaru: data.riwayatKBBaru || 'tidak pernah',
        papSmear: data.papSmear === 'ya',
        tesIVA: data.tesIVA === 'ya',
        merokok: data.merokok,
        kurangAktifitas: data.kurangAktifitas === 'ya',
        kurangKonsumsiBuah: data.kurangKonsumsiBuah === 'ya',
      };

      // Conditional fields
      if (data.masihHaid === 'Tidak') {
        payload.umurMenopause = transformNumber(data.umurMenopause);
      } else {
        payload.tanggalTerakhirHaid = data.tanggalTerakhirHaid;
      }

      if (data.pernahMenyusui === 'Ya') {
        payload.lamaMenyusuiBulan = transformNumber(data.lamaMenyusuiBulan);
      }

      // KB duration fields
      if (data.riwayatKBLama === 'pilKb') {
        payload.durasiPilKBLama = transformNumber(data.durasiPilKBLama);
      } else if (data.riwayatKBLama === 'suntikKb') {
        payload.durasiSuntikKBLama = transformNumber(data.durasiSuntikKBLama);
      }

      if (data.riwayatKBBaru === 'pilKb') {
        payload.durasiPilKBBaru = transformNumber(data.durasiPilKBBaru);
      } else if (data.riwayatKBBaru === 'suntikKb') {
        payload.durasiSuntikKBBaru = transformNumber(data.durasiSuntikKBBaru);
      }

      if (data.merokok === 'masih') {
        payload.merokokAktif = transformNumber(data.merokokAktif);
      }

      // Send to API
      await axios.post(`http://localhost:3000/api/riwayat-reproduksi`, payload);
      
      alert('Data berhasil disimpan!');
    } catch (error) {
      let errorMessage = 'Gagal menyimpan data';
      if (error.response) {
        errorMessage = error.response.data?.error || 
                     error.response.data?.message || 
                     `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Tidak ada respon dari server';
      } else {
        errorMessage = error.message;
      }
      alert(errorMessage);
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  if (!identitasPasienId) {
    return <div className="text-center py-8 text-red-600">ID Pasien tidak ditemukan</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Kesehatan Reproduksi</h1>
      <p className="text-sm text-gray-600 mb-4">ID Pasien: {identitasPasienId}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usia Pertama Haid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Pertama Haid (tahun)
            </label>
            <input
              type="number"
              min="8"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("usiaPertamaHaid")}
            />
            {errors.usiaPertamaHaid && (
              <p className="mt-1 text-sm text-red-600">Usia harus antara 8-20 tahun</p>
            )}
          </div>

          {/* Usia Pertama Kawin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Pertama Kawin (tahun)
            </label>
            <input
              type="number"
              min="10"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("usiaPertamaKawin")}
            />
          </div>

          {/* Usia Pertama Hamil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Pertama Hamil (tahun)
            </label>
            <input
              type="number"
              min="10"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("usiaPertamaHamil")}
            />
          </div>

          {/* Konsumsi Alkohol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konsumsi Alkohol
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("konsumsiAlkohol")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("konsumsiAlkohol")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Masih Haid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masih Haid?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("masihHaid")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("masihHaid")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Tanggal Terakhir Haid atau Umur Menopause */}
          {masihHaid === 'Ya' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Terakhir Haid
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("tanggalTerakhirHaid")}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umur Menopause (tahun)
              </label>
              <input
                type="number"
                min="30"
                max="70"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("umurMenopause")}
              />
            </div>
          )}

          {/* Jumlah Melahirkan Normal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Melahirkan Normal
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("jumlahMelahirkanNormal")}
            />
          </div>

          {/* Jumlah Melahirkan Caesar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Melahirkan Caesar
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("jumlahMelahirkanCaesar")}
            />
          </div>

          {/* Jumlah Keguguran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Keguguran
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("jumlahKeguguran")}
            />
          </div>

          {/* Pernah Menyusui */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pernah Menyusui?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("pernahMenyusui")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("pernahMenyusui")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Lama Menyusui (bulan) */}
          {pernahMenyusui === 'Ya' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lama Menyusui (bulan)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("lamaMenyusuiBulan")}
              />
            </div>
          )}

          {/* Riwayat KB Lama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Riwayat KB Lama
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("riwayatKBLama")}
            >
              <option value="tidak pernah">Tidak Pernah</option>
              <option value="pilKb">Pil KB</option>
              <option value="suntikKb">Suntik KB</option>
              <option value="spiral">Spiral</option>
              <option value="susuk">Susuk</option>
              <option value="steril">Steril</option>
              <option value="kondom">Kondom</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Durasi KB Lama */}
          {riwayatKBLama === 'pilKb' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Pil KB Lama (tahun)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("durasiPilKBLama")}
              />
            </div>
          )}

          {riwayatKBLama === 'suntikKb' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Suntik KB Lama (tahun)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("durasiSuntikKBLama")}
              />
            </div>
          )}

          {/* Riwayat KB Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Riwayat KB Baru
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("riwayatKBBaru")}
            >
              <option value="tidak pernah">Tidak Pernah</option>
              <option value="pilKb">Pil KB</option>
              <option value="suntikKb">Suntik KB</option>
              <option value="spiral">Spiral</option>
              <option value="susuk">Susuk</option>
              <option value="steril">Steril</option>
              <option value="kondom">Kondom</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Durasi KB Baru */}
          {riwayatKBBaru === 'pilKb' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Pil KB Baru (tahun)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("durasiPilKBBaru")}
              />
            </div>
          )}

          {riwayatKBBaru === 'suntikKb' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Suntik KB Baru (tahun)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("durasiSuntikKBBaru")}
              />
            </div>
          )}

          {/* Pap Smear */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pernah Pap Smear?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("papSmear")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("papSmear")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Tes IVA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pernah Tes IVA?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("tesIVA")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("tesIVA")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Merokok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kebiasaan Merokok
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("merokok")}
            >
              <option value="tidak">Tidak Merokok</option>
              <option value="pernah">Pernah Merokok</option>
              <option value="masih">Masih Merokok</option>
            </select>
          </div>

          {/* Merokok Aktif */}
          {merokok === 'masih' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Rokok per Hari
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("merokokAktif")}
              />
            </div>
          )}

          {/* Kurang Aktifitas Fisik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kurang Aktifitas Fisik?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("kurangAktifitas")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("kurangAktifitas")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>

          {/* Kurang Konsumsi Buah/Sayur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kurang Konsumsi Buah/Sayur?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ya"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("kurangKonsumsiBuah")}
                />
                <span className="ml-2 text-gray-700">Ya</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="tidak"
                  className="form-radio h-4 w-4 text-blue-600"
                  {...register("kurangKonsumsiBuah")}
                />
                <span className="ml-2 text-gray-700">Tidak</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : 'Simpan Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiwayatKesehatanReproduksiForm;