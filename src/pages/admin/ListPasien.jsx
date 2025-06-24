import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Phone, Calendar, Ruler, Weight, Droplet, Edit, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListPasien = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data dari API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/pasien');
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Gagal memuat data pasien. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredPatients = patients.filter(patient =>
    patient.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nik?.includes(searchTerm) ||
    patient.kota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #410445 0%, #A5158C 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white bg-opacity-20 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="h-16 bg-gray-200"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 border-b border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#410445] to-[#FF2DF1] p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Kesalahan</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#FF2DF1] hover:bg-[#F6DC43] text-white font-semibold py-2 px-4 rounded transition"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #410445 0%, #A5158C 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Daftar Pasien</h1>
          <p className="text-white text-opacity-80">Total {filteredPatients.length} pasien terdaftar</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A5158C' }} />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent shadow-lg bg-white"
              style={{ borderColor: '#F6DC43' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'linear-gradient(90deg, #410445 0%, #A5158C 100%)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Pasien</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Umur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">NIK</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Alamat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">No. HP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Fisik</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Gol. Darah</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tgl. Daftar</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:shadow-lg transition-all duration-200 bg-white"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: '#FF2DF1' }}
                        >
                          {patient.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#F6DC43' }}
                        >
                          <User className="w-5 h-5" style={{ color: '#410445' }} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.nama}</div>
                          <div className="text-sm text-gray-500">Suku: {patient.suku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculateAge(patient.tanggalLahir)} tahun</div>
                      <div className="text-sm text-gray-500">{formatDate(patient.tanggalLahir)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{patient.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{patient.alamat}</div>
                      <div className="text-sm text-gray-500">{patient.kota}, {patient.provinsi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" style={{ color: '#A5158C' }} />
                        <span className="text-sm text-gray-900">{patient.noHp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: '#410445' }}
                        >
                          {patient.beratBadan}kg
                        </div>
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: '#A5158C' }}
                        >
                          {patient.tinggiBadan}cm
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: '#FF2DF1' }}
                      >
                        <Droplet className="w-4 h-4 mr-1" />
                        {patient.golonganDarah}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(patient.createdAt)}</div>
                    </td>
                 <td className="px-6 py-4 whitespace-nowrap text-center">
  <div className="flex flex-col items-center space-y-2">
    {/* Tombol Aksi */}
    <div className="flex items-center justify-center space-x-2">
      <button 
        className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
        style={{ backgroundColor: '#F6DC43' }}
        title="Lihat Detail"
      >
        <Eye className="w-4 h-4" style={{ color: '#410445' }} />
      </button>
      <button 
        className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
        style={{ backgroundColor: '#A5158C' }}
        title="Edit"
      >
        <Edit className="w-4 h-4 text-white" />
      </button>
      <button 
        className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
        style={{ backgroundColor: '#FF2DF1' }}
        title="Hapus"
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>
    </div>

    {/* Tombol Periksa di Bawah */}
    <button 
      onClick={() => navigate(`/periksaPasien/${patient.id}`)}
      className="px-3 py-1 rounded-lg text-white text-sm font-medium hover:shadow-md transition-all duration-200"
      style={{ backgroundColor: '#10B981' }} // Hijau modern
    >
      Periksa
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-2xl">
            <User className="w-16 h-16 mx-auto mb-4" style={{ color: '#A5158C' }} />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak ada pasien ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian Anda</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-white text-opacity-80 text-sm">
            Sistem Informasi Pasien - Data Real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListPasien;