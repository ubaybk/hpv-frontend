import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RiwayatKesehatanReproduksiForm = () => {
  const { id: identitasPasienId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      masihHaid: 'Ya',
      pernahMenyusui: 'Tidak',
      konsumsiAlkohol: 'tidak',
      papSmear: 'tidak',
      tesIVA: 'tidak',
      kurangAktifitas: 'tidak',
      kurangKonsumsiBuah: 'tidak',
      merokok: 'tidak',
      usiaPertamaHamil: '', // ✅ Tetap seperti semula
    },
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
          Object.keys(response.data).forEach(key => {
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

  // Load data dari localStorage jika tersedia
  useEffect(() => {
    const savedData = localStorage.getItem(`riwayatReproduksi-${identitasPasienId}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        if (typeof parsedData[key] === 'boolean') {
          setValue(key, parsedData[key] ? 'ya' : 'tidak');
        } else {
          setValue(key, parsedData[key]);
        }
      });
    }

    // Cek apakah user sudah isi form pertama
    const identitasData = localStorage.getItem('identitasPasien');
    if (!identitasData) {
      toast.error('Anda harus mengisi data identitas pasien terlebih dahulu.', {
        autoClose: 3000,
        onClose: () => navigate('/')
      });
    }
  }, [identitasPasienId,  setValue, navigate]);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data); // ✅ Debugging
    setIsSubmitting(true);

    try {
      const transformNumber = (value) => {
        if (value === "" || value === undefined || value === null) return null;
        const num = parseInt(value);
        return isNaN(num) ? null : num;
      };

      const payload = {
        identitasPasienId: parseInt(identitasPasienId),
        usiaPertamaHaid: transformNumber(data.usiaPertamaHaid),
        usiaPertamaKawin: transformNumber(data.usiaPertamaKawin),
        usiaPertamaHamil: transformNumber(data.usiaPertamaHamil),
        konsumsiAlkohol: data.konsumsiAlkohol === 'ya',
        masihHaid: data.masihHaid || 'Ya',
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

      // Handle conditional fields
      if (data.masihHaid === 'Ya' && data.tanggalTerakhirHaid) {
        payload.tanggalTerakhirHaid = new Date(data.tanggalTerakhirHaid).toISOString();
      } else if (data.masihHaid === 'Tidak') {
        payload.umurMenopause = transformNumber(data.umurMenopause);
      }

      if (data.pernahMenyusui === 'Ya') {
        payload.lamaMenyusuiBulan = transformNumber(data.lamaMenyusuiBulan);
      }

      // KB lama
      if (data.riwayatKBLama === 'pilKb') {
        payload.durasiPilKBLama = transformNumber(data.durasiPilKBLama);
      } else if (data.riwayatKBLama === 'suntikKb') {
        payload.durasiSuntikKBLama = transformNumber(data.durasiSuntikKBLama);
      } else if (data.riwayatKBLama === "Spiral") {
        payload.durasiSpiralKBLama = transformNumber(data.durasiSpiralKBLama)
      } else if (data.riwayatKBLama === "Susuk"){
        payload.durasiSusukKBLama = transformNumber(data.durasiSusukKBLama)
      }

      // KB baru
      if (data.riwayatKBBaru === 'pilKb') {
        payload.durasiPilKBBaru = transformNumber(data.durasiPilKBBaru);
      } else if (data.riwayatKBBaru === 'suntikKb') {
        payload.durasiSuntikKBBaru = transformNumber(data.durasiSuntikKBBaru);
      }

      // Merokok aktif
      if (data.merokok === 'masih') {
        payload.merokokAktif = transformNumber(data.merokokAktif);
      }

      // Simpan ke localStorage
      localStorage.setItem(`riwayatReproduksi-${identitasPasienId}`, JSON.stringify(payload));

      // Navigasi ke halaman berikutnya
      setTimeout(() => {
        setIsSubmitting(false);
        navigate(`/riwayatKankerDalamKeluarga/${identitasPasienId}`);
      }, 800);
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
      toast.error(errorMessage, {
        autoClose: 5000,
      });
      console.error("Error details:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] flex items-center justify-center">
        <p className="text-white text-xl">Memuat data...</p>
      </div>
    );
  }

  if (!identitasPasienId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] flex items-center justify-center">
        <p className="text-white text-xl">ID Pasien tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Riwayat Kesehatan Reproduksi
            </h1>
            <p className="text-white/80 text-lg">
              Silakan lengkapi informasi tambahan pasien
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 space-y-8">
          {/* Usia Pertama Haid & Kawin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Usia Pertama Haid (tahun)</label>
              <input
                type="number"
                min="8"
                max="20"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("usiaPertamaHaid")}
              />
              {errors.usiaPertamaHaid && (
                <p className="mt-1 text-sm text-red-600">Usia harus antara 8-20 tahun</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Usia Pertama Kawin (tahun)</label>
              <input
                type="number"
                min="10"
                max="60"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("usiaPertamaKawin")}
              />
            </div>
          </div>

          {/* Usia Pertama Hamil */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#410445]">Usia Pertama Hamil (tahun)</label>
            <input
              type="number"
              min="10"
              max="60"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
              {...register("usiaPertamaHamil", { required: true })}
            />
            {errors.usiaPertamaHamil && (
              <p className="mt-1 text-sm text-red-600">Wajib diisi</p>
            )}
          </div>

          {/* Masih Haid & Tanggal Terakhir Haid atau Umur Menopause */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Masih Haid?</label>
              <div className="flex space-x-4 mt-2">
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
            {masihHaid === 'Ya' ? (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Tanggal Terakhir Haid</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  {...register("tanggalTerakhirHaid")}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Umur Menopause (tahun)</label>
                <input
                  type="number"
                  min="30"
                  max="70"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  {...register("umurMenopause")}
                />
              </div>
            )}
          </div>

          {/* Jumlah Melahirkan Normal & Caesar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Jumlah Melahirkan Normal</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("jumlahMelahirkanNormal")}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Jumlah Melahirkan Caesar</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("jumlahMelahirkanCaesar")}
              />
            </div>
          </div>

          {/* Jumlah Keguguran & Pernah Menyusui */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Jumlah Keguguran</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("jumlahKeguguran")}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Pernah Menyusui?</label>
              <div className="flex space-x-4 mt-2">
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
          </div>

          {/* Lama Menyusui (bulan) jika Ya */}
          {pernahMenyusui === 'Ya' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Lama Menyusui (bulan)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("lamaMenyusuiBulan")}
              />
            </div>
          )}

          {/* Riwayat KB Lama & Baru */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Riwayat KB Lama</label>
              <select
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("riwayatKBLama")}
              >
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="pilKb">Pil KB</option>
                <option value="suntikKb">Suntik KB</option>
                <option value="Spiral">Spiral</option>
                <option value="Susuk">Susuk</option>
                <option value="steril">Steril</option>
                <option value="kondom">Kondom</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Riwayat KB Baru</label>
              <select
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("riwayatKBBaru")}
              >
                <option value="tidak pernah">Tidak Pernah</option>
                <option value="pilKb">Pil KB</option>
                <option value="suntikKb">Suntik KB</option>
                <option value="Spiral">Spiral</option>
                <option value="Susuk">Susuk</option>
                <option value="steril">Steril</option>
                <option value="kondom">Kondom</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Durasi KB Lama */}
          {riwayatKBLama === 'pilKb' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Pil KB Lama (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiPilKBLama")}
              />
            </div>
          )}
          {riwayatKBLama === 'suntikKb' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Suntik KB Lama (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiSuntikKBLama")}
              />
            </div>
          )}
          {riwayatKBLama === 'Spiral' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Spiral KB Lama (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiSpiralKBLama")}
              />
            </div>
          )}
          {riwayatKBLama === 'Susuk' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Susuk KB Lama (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiSusukKBLama")}
              />
            </div>
          )}

          {/* Durasi KB Baru */}
          {riwayatKBBaru === 'pilKb' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Pil KB Baru (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiPilKBBaru")}
              />
            </div>
          )}
          {riwayatKBBaru === 'suntikKb' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Durasi Suntik KB Baru (tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("durasiSuntikKBBaru")}
              />
            </div>
          )}

          {/* Pap Smear & Tes IVA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Pernah Pap Smear?</label>
              <div className="flex space-x-4 mt-2">
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Pernah Tes IVA?</label>
              <div className="flex space-x-4 mt-2">
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
          </div>

          {/* Merokok & Rokok Aktif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Kebiasaan Merokok</label>
              <select
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                {...register("merokok")}
              >
                <option value="tidak">Tidak Merokok</option>
                <option value="pernah">Pernah Merokok</option>
                <option value="masih">Masih Merokok</option>
              </select>
            </div>
            {merokok === 'masih' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#410445]">Jumlah Rokok per Hari</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF2DF1] focus:ring-2 focus:ring-[#FF2DF1]/20 transition-all duration-300 outline-none"
                  {...register("merokokAktif")}
                />
              </div>
            )}
          </div>

          {/* Kurang Aktivitas Fisik & Konsumsi Buah/Sayur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Kurang Aktifitas Fisik?</label>
              <div className="flex space-x-4 mt-2">
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#410445]">Kurang Konsumsi Buah/Sayur?</label>
              <div className="flex space-x-4 mt-2">
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

          {/* Submit Button */}
         <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6 border-t border-gray-200">
            {/* Tombol Kembali */}
            <button
  type="button"
  onClick={() => navigate(`/riwayatIdentitas/${identitasPasienId}`)}
  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg ...">
  <span className="flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Kembali ke Riwayat Identitas
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Data
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

export default RiwayatKesehatanReproduksiForm;