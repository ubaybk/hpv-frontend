import { useState } from 'react';
import { Search, User, Calendar, MapPin, Phone, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CekNik = () => {
    const [nik, setNik] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    

    const handleSearch = async () => {
        if (!nik || nik.length !== 16) {
            setError('NIK harus 16 digit');
            return;
        }

        setLoading(true);
        setError('');
        setUserData(null);

        try {
            const response = await fetch(`http://localhost:3000/api/pasien?nik=${nik}`);
            
            if (!response.ok) {
                throw new Error('Data tidak ditemukan');
            }

            const data = await response.json();
            
            const foundUser = Array.isArray(data) 
                ? data.find(user => user.nik === nik)
                : data.nik === nik ? data : null;

            if (foundUser) {
                setUserData(foundUser);
            } else {
                setError('Data pasien dengan NIK tersebut tidak ditemukan');
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat mengambil data');
        } finally {
            setLoading(false);
        }
    };

    const handleNikChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 16) {
            setNik(value);
            setError('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLihatHasil = () => {
        if (userData && userData.id) {
            // Untuk navigasi, Anda perlu menggunakan router yang sesuai
            // Contoh jika menggunakan React Router:
            window.location.href = `/lihatHasil/${userData.id}`;
            
            // Atau jika menggunakan Next.js router:
            // router.push(`/lihatHasil/${userData.id}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak tersedia';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 pt-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F6DC43] to-[#FF2DF1] rounded-full mb-6 shadow-2xl">
                        <Search className="text-[#410445]" size={36} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Cek Data Pasien
                    </h1>
                    <p className="text-[#F6DC43] text-lg md:text-xl font-medium">
                        Masukkan NIK untuk melihat informasi lengkap pasien
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-white text-sm font-semibold mb-3 tracking-wide">
                                Nomor Induk Kependudukan (NIK)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={nik}
                                    onChange={handleNikChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Masukkan 16 digit NIK"
                                    className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-[#F6DC43]/50 focus:border-[#F6DC43] transition-all duration-300 text-lg font-medium"
                                    maxLength={16}
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#F6DC43] text-sm font-medium">
                                    {nik.length}/16
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading || nik.length !== 16}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#F6DC43] to-[#FF8C00] text-[#410445] font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg min-w-[160px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        <Search size={24} />
                                        Cari Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-2xl p-6 mb-8 flex items-center gap-4 animate-shake">
                        <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                            <AlertCircle className="text-red-200" size={28} />
                        </div>
                        <div>
                            <h3 className="text-red-200 font-semibold text-lg">Error</h3>
                            <p className="text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* User Data Display */}
                {userData && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeIn">
                        {/* Header Profile */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white/5 rounded-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#F6DC43] to-[#FF2DF1] rounded-full flex items-center justify-center shadow-xl">
                                <User className="text-[#410445]" size={40} />
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {userData.nama || 'Nama Tidak Tersedia'}
                                </h2>
                                <p className="text-[#F6DC43] text-lg font-medium">NIK: {userData.nik}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                        Data Ditemukan
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                        ID: {userData.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-[#F6DC43]/20 rounded-lg flex items-center justify-center">
                                        <User className="text-[#F6DC43]" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Informasi Personal</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        <Calendar className="text-[#F6DC43] mt-1" size={20} />
                                        <div>
                                            <p className="text-white/60 text-sm font-medium">Tempat, Tanggal Lahir</p>
                                            <p className="text-white font-medium">
                                                {userData.tempatLahir || 'Tidak tersedia'}, {formatDate(userData.tanggalLahir)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        <User className="text-[#F6DC43] mt-1" size={20} />
                                        <div>
                                            <p className="text-white/60 text-sm font-medium">Suku</p>
                                            <p className="text-white font-medium">
                                                {userData.suku || 'Tidak tersedia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        <MapPin className="text-[#F6DC43] mt-1" size={20} />
                                        <div>
                                            <p className="text-white/60 text-sm font-medium">Alamat Lengkap</p>
                                            <p className="text-white font-medium">
                                                {userData.alamat || 'Tidak tersedia'}
                                            </p>
                                            <p className="text-white/80 text-sm mt-1">
                                                {userData.kecamatan}, {userData.kota}, {userData.provinsi}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Health Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-[#FF2DF1]/20 rounded-lg flex items-center justify-center">
                                        <Phone className="text-[#FF2DF1]" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Informasi Kontak & Fisik</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        <Phone className="text-[#FF2DF1] mt-1" size={20} />
                                        <div>
                                            <p className="text-white/60 text-sm font-medium">Nomor Telepon</p>
                                            <p className="text-white font-medium">
                                                {userData.noHp || 'Tidak tersedia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        <Mail className="text-[#FF2DF1] mt-1" size={20} />
                                        <div>
                                            <p className="text-white/60 text-sm font-medium">Golongan Darah</p>
                                            <p className="text-white font-medium">
                                                {userData.golonganDarah?.toUpperCase() || 'Tidak tersedia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl text-center">
                                            <p className="text-white/60 text-sm font-medium">Berat Badan</p>
                                            <p className="text-white font-bold text-lg">
                                                {userData.beratBadan ? `${userData.beratBadan} kg` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl text-center">
                                            <p className="text-white/60 text-sm font-medium">Tinggi Badan</p>
                                            <p className="text-white font-bold text-lg">
                                                {userData.tinggiBadan ? `${userData.tinggiBadan} cm` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {userData.namaSuami && (
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                            <User className="text-[#FF2DF1] mt-1" size={20} />
                                            <div>
                                                <p className="text-white/60 text-sm font-medium">Nama Suami</p>
                                                <p className="text-white font-medium">
                                                    {userData.namaSuami}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 p-6 bg-white/5 rounded-2xl">
                            <button
                                onClick={() => alert('Fitur Cek HPV akan segera tersedia')}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-[#F6DC43] to-[#FFE55C] text-[#410445] font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                            >
                                🔬 CEK HPV
                            </button>
                            <button
                                onClick={handleLihatHasil}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FF2DF1] to-[#FF6BB3] text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                            >
                                📋 Lihat Hasil Lengkap
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!userData && !loading && !error && (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Search className="text-white/60" size={64} />
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-4">Mulai Pencarian</h3>
                        <p className="text-white/60 text-lg max-w-md mx-auto">
                            Masukkan NIK 16 digit untuk menampilkan informasi lengkap data pasien
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CekNik;