import { useState, useEffect } from 'react';
import { 
    ArrowLeft, AlertCircle, User, Calendar, MapPin, Phone, Mail, Heart, 
    FileText, Activity, Users, Loader2, 
    CheckCircle, XCircle, Baby, Scale, Ruler, TestTube 
} from 'lucide-react';

const LihatHasil = () => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    // Get ID from URL params (adjust based on your routing solution)
    const getPatientId = () => {
        // For demonstration, using window.location
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            const patientId = getPatientId();
            
            if (!patientId || patientId === 'lihatHasil') {
                setError('ID pasien tidak valid');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/pasien/${patientId}`);
                
                if (!response.ok) {
                    throw new Error('Data pasien tidak ditemukan');
                }

                const data = await response.json();
                setPatientData(data);
            } catch (err) {
                setError(err.message || 'Terjadi kesalahan saat mengambil data');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Tidak tersedia';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getBMI = (weight, height) => {
        if (!weight || !height) return 'N/A';
        const bmi = weight / ((height / 100) ** 2);
        return bmi.toFixed(1);
    };

    const getBMICategory = (bmi) => {
        if (bmi === 'N/A') return 'N/A';
        const bmiNum = parseFloat(bmi);
        if (bmiNum < 18.5) return 'Underweight';
        if (bmiNum < 25) return 'Normal';
        if (bmiNum < 30) return 'Overweight';
        return 'Obese';
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-white mx-auto mb-4" size={64} />
                    <h2 className="text-white text-2xl font-bold">Memuat Data Pasien...</h2>
                    <p className="text-white/60">Harap tunggu sebentar</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-md">
                    <AlertCircle className="text-red-300 mx-auto mb-4" size={64} />
                    <h2 className="text-white text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-gradient-to-r from-[#F6DC43] to-[#FF8C00] text-[#410445] font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'personal', label: 'Data Personal', icon: User },
        { id: 'identity', label: 'Riwayat Identitas', icon: FileText },
        { id: 'health', label: 'Kesehatan Reproduksi', icon: Heart },
        { id: 'family', label: 'Riwayat Keluarga', icon: Users },
        { id: 'complaints', label: 'Keluhan', icon: AlertCircle },
        { id: 'results', label: 'Hasil Lab', icon: Activity }
    ];

    const renderPersonalTab = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="text-[#F6DC43]" size={28} />
                Data Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Tempat, Tanggal Lahir</h4>
                    </div>
                    <p className="text-white/80">{patientData?.tempatLahir}, {formatDate(patientData?.tanggalLahir)}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <User className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Suku</h4>
                    </div>
                    <p className="text-white/80">{patientData?.suku || 'Tidak tersedia'}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Phone className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">No. HP</h4>
                    </div>
                    <p className="text-white/80">{patientData?.noHp || 'Tidak tersedia'}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Alamat Lengkap</h4>
                    </div>
                    <p className="text-white/80">{patientData?.alamat}</p>
                    <p className="text-white/60 text-sm mt-2">
                        RT {patientData?.rt} / RW {patientData?.rw}, {patientData?.kecamatan}, {patientData?.kota}, {patientData?.provinsi}
                    </p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Mail className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Golongan Darah</h4>
                    </div>
                    <p className="text-white/80">{patientData?.golonganDarah?.toUpperCase() || 'Tidak tersedia'}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Scale className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Berat Badan</h4>
                    </div>
                    <p className="text-white/80">{patientData?.beratBadan ? `${patientData.beratBadan} kg` : 'Tidak tersedia'}</p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Ruler className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">Tinggi Badan</h4>
                    </div>
                    <p className="text-white/80">{patientData?.tinggiBadan ? `${patientData.tinggiBadan} cm` : 'Tidak tersedia'}</p>
                </div>

                {patientData?.namaSuami && (
                    <div className="p-6 bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <User className="text-[#F6DC43]" size={20} />
                            <h4 className="text-white font-semibold">Nama Suami</h4>
                        </div>
                        <p className="text-white/80">{patientData.namaSuami}</p>
                    </div>
                )}

                <div className="p-6 bg-gradient-to-br from-[#F6DC43]/20 to-[#FF2DF1]/20 rounded-2xl border border-[#F6DC43]/30">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="text-[#F6DC43]" size={20} />
                        <h4 className="text-white font-semibold">BMI</h4>
                    </div>
                    <p className="text-white/80 text-2xl font-bold">{getBMI(patientData?.beratBadan, patientData?.tinggiBadan)}</p>
                    <p className="text-[#F6DC43] text-sm">{getBMICategory(getBMI(patientData?.beratBadan, patientData?.tinggiBadan))}</p>
                </div>
            </div>
        </div>
    );

    const renderIdentityTab = () => {
    const identities = patientData?.riwayatIdentitas || [];
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="text-[#F6DC43]" size={28} />
                Riwayat Identitas
            </h3>
            {identities.length > 0 ? (
                <div className="space-y-6">
                    {identities.map((identity, index) => (
                        <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-white font-semibold">Riwayat ke-{index + 1}</h4>
                                <span className="text-xs text-white/60">
                                    {formatDate(identity.createdAt)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Status Kawin Klien</p>
                                    <p className="text-white font-medium">{identity.statusKawinKlien || 'Tidak tersedia'}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Status Kawin Suami</p>
                                    <p className="text-white font-medium">{identity.statusKawinSuami || 'Tidak tersedia'}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Pendidikan Klien</p>
                                    <p className="text-white font-medium">{identity.pendidikanKlien || 'Tidak tersedia'}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Pekerjaan Klien</p>
                                    <p className="text-white font-medium">{identity.pekerjaanKlien || 'Tidak tersedia'}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Pekerjaan Suami</p>
                                    <p className="text-white font-medium">{identity.pekerjaanSuami || 'Tidak tersedia'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FileText className="text-white/40 mx-auto mb-4" size={64} />
                    <p className="text-white/60">Belum ada riwayat identitas</p>
                </div>
            )}
        </div>
    );
};

   const renderHealthTab = () => {
    const healthRecords = patientData?.riwayatKesehatanReproduksi || [];
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Heart className="text-[#F6DC43]" size={28} />
                Kesehatan Reproduksi
            </h3>
            {healthRecords.length > 0 ? (
                <div className="space-y-6">
                    {healthRecords.map((record, index) => (
                        <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-white font-semibold">Catatan ke-{index + 1}</h4>
                                <span className="text-xs text-white/60">
                                    {formatDate(record.createdAt)}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {/* Menstruasi */}
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-3">Menstruasi</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Usia Pertama Haid</p>
                                            <p className="text-white font-medium">{record.usiaPertamaHaid || 'N/A'} tahun</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Masih Haid</p>
                                            <p className="text-white font-medium">{record.masihHaid || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Umur Menopause</p>
                                            <p className="text-white font-medium">{record.umurMenopause || 'N/A'} tahun</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Kehamilan */}
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-3">Kehamilan & Persalinan</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Usia Pertama Hamil</p>
                                            <p className="text-white font-medium">{record.usiaPertamaHamil || 'N/A'} tahun</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Melahirkan Normal</p>
                                            <p className="text-white font-medium">{record.jumlahMelahirkanNormal || 0} kali</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Melahirkan Caesar</p>
                                            <p className="text-white font-medium">{record.jumlahMelahirkanCaesar || 0} kali</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Keguguran</p>
                                            <p className="text-white font-medium">{record.jumlahKeguguran || 0} kali</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Pernah Menyusui</p>
                                            <p className="text-white font-medium">{record.pernahMenyusui || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Kesehatan */}
                                <div>
                                    <h4 className="text-xl font-semibold text-white mb-3">Status Kesehatan</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                            {record.papSmear ? 
                                                <CheckCircle className="text-green-400" size={20} /> : 
                                                <XCircle className="text-red-400" size={20} />
                                            }
                                            <div>
                                                <p className="text-white/60 text-sm">Pap Smear</p>
                                                <p className="text-white font-medium">{record.papSmear ? 'Ya' : 'Tidak'}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                            {record.tesIVA ? 
                                                <CheckCircle className="text-green-400" size={20} /> : 
                                                <XCircle className="text-red-400" size={20} />
                                            }
                                            <div>
                                                <p className="text-white/60 text-sm">Tes IVA</p>
                                                <p className="text-white font-medium">{record.tesIVA ? 'Ya' : 'Tidak'}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <p className="text-white/60 text-sm">Merokok</p>
                                            <p className="text-white font-medium">{record.merokok || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Heart className="text-white/40 mx-auto mb-4" size={64} />
                    <p className="text-white/60">Belum ada catatan kesehatan reproduksi</p>
                </div>
            )}
        </div>
    );
};

    const renderFamilyTab = () => {
    const familyCancerHistory = patientData?.riwayatKankerDalamKeluarga || [];
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="text-[#F6DC43]" size={28} />
                Riwayat Kanker dalam Keluarga
            </h3>
            {familyCancerHistory.length > 0 ? (
                <div className="space-y-6">
                    {familyCancerHistory.map((record, index) => (
                        <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-white font-semibold">Catatan ke-{index + 1}</h4>
                                <span className="text-xs text-white/60">
                                    {formatDate(record.createdAt)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {record.tumorJinakPayudara ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Tumor Jinak Payudara</p>
                                        <p className="text-white font-medium">{record.tumorJinakPayudara ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {record.hubunganDarah ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Hubungan Darah</p>
                                        <p className="text-white font-medium">{record.hubunganDarah ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Siapa yang Sakit</p>
                                    <p className="text-white font-medium">{record.siapaYangSakit || 'Tidak tersedia'}</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-lg">
                                    <p className="text-white/60 text-sm">Jenis Kanker</p>
                                    <p className="text-white font-medium">{record.kankerApa || 'Tidak tersedia'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Users className="text-white/40 mx-auto mb-4" size={64} />
                    <p className="text-white/60">Belum ada riwayat kanker dalam keluarga</p>
                </div>
            )}
        </div>
    );
};

const renderComplaintsTab = () => {
    const complaints = patientData?.keluhan || [];
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <AlertCircle className="text-[#F6DC43]" size={28} />
                Riwayat Keluhan
            </h3>
            {complaints.length > 0 ? (
                <div className="space-y-6">
                    {complaints.map((keluhan, index) => (
                        <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/20 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-white font-semibold">Keluhan ke-{index + 1}</h4>
                                <span className="text-xs text-white/60">
                                    {formatDate(keluhan.createdAt)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Benjolan di Payudara/Ketiak */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.benjolanDiPayudaraKetiak ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Benjolan di Payudara/Ketiak</p>
                                        <p className="text-white font-medium">{keluhan.benjolanDiPayudaraKetiak ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                {/* Cairan dari Puting */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.keluarCairanDariPuting ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Keluar Cairan dari Puting</p>
                                        <p className="text-white font-medium">{keluhan.keluarCairanDariPuting ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                {/* Cairan Banyak dari Kemaluan */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.keluarBanyakCairanDariKemaluan ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Keluar Banyak Cairan dari Kemaluan</p>
                                        <p className="text-white font-medium">{keluhan.keluarBanyakCairanDariKemaluan ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                {/* Pendarahan Saat/Sesudah Senggama */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.pendarahanSaatSetelahSenggama ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Pendarahan Saat/Sesudah Senggama</p>
                                        <p className="text-white font-medium">{keluhan.pendarahanSaatSetelahSenggama ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                {/* Pendarahan Di Luar Masa Haid */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.pendarahanDiluarMasaHaid ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Pendarahan Diluar Masa Haid</p>
                                        <p className="text-white font-medium">{keluhan.pendarahanDiluarMasaHaid ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>

                                {/* Nyeri di Perut Bawah/Pinggul */}
                                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                    {keluhan.sakitNyeriDiPerutBawahPinggul ? 
                                        <CheckCircle className="text-green-400" size={20} /> : 
                                        <XCircle className="text-red-400" size={20} />
                                    }
                                    <div>
                                        <p className="text-white/60 text-sm">Nyeri di Perut Bawah/Pinggul</p>
                                        <p className="text-white font-medium">{keluhan.sakitNyeriDiPerutBawahPinggul ? 'Ya' : 'Tidak'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Lain-lain */}
                            <div className="mt-4 p-3 bg-white/10 rounded-lg">
                                <p className="text-white/60 text-sm">Lain-lain</p>
                                <p className="text-white font-medium">{keluhan.lainLain || '-'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <AlertCircle className="text-white/40 mx-auto mb-4" size={64} />
                    <p className="text-white/60">Belum ada riwayat keluhan</p>
                </div>
            )}
        </div>
    );
};

    const renderResultsTab = () => {
    // const hasLabResults = patientData?.hasilPemeriksaanLab && patientData.hasilPemeriksaanLab.length > 0;
    // const hasKeluhan = patientData?.keluhan && patientData.keluhan.length > 0;

     const hasLabResults = patientData?.hasilPemeriksaanLab && patientData.hasilPemeriksaanLab.length > 0;
        const hasKeluhan = patientData?.keluhan && patientData.keluhan.length > 0;

    return (
      
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Activity className="text-[#F6DC43]" size={28} />
                    Hasil Pemeriksaan & Keluhan
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Keluhan */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-[#FF2DF1] to-[#A5158C] rounded-lg">
                                <TestTube className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white">Hasil Pemeriksaan IVA & Payudara</h4>
                        </div>
                        {/* {hasKeluhan ? (
                            <div className="space-y-4">
                                {patientData.keluhan.map((keluhan, index) => (
                                    <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <p className="text-white/80">{keluhan.deskripsi || 'Tidak ada deskripsi'}</p>
                                        <p className="text-white/60 text-sm mt-2">
                                            {formatDate(keluhan.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="text-white/40 mx-auto mb-3" size={48} />
                                <p className="text-white/60">Tidak ada keluhan tercatat</p>
                            </div>
                        )} */}
                        {hasLabResults ? (
                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                {patientData.hasilPemeriksaanLab.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-5 bg-white/5 rounded-xl border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-white font-semibold text-lg">
                                                {result.jenisPemeriksaan || 'Jenis Tes Tidak Diketahui'}
                                            </h5>
                                            <span className="text-xs text-white/60">
                                                {result.createdAt ? formatDate(result.createdAt) : 'Tanggal Tidak Tersedia'}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#FF2DF1]"></span> Sub Type 16:
                                                <span className="font-medium ml-1">{result.subType16 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#F6DC43]"></span> Sub Type 18:
                                                <span className="font-medium ml-1">{result.subType18 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#A5158C]"></span> Sub Type 52:
                                                <span className="font-medium ml-1">{result.subType52 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#410445]"></span> Sub Type Lainnya:
                                                <span className="font-medium ml-1">{result.subTypeLainnya ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            
                                            <p className="text-white/70 mt-2">Metode: 
                                                <span className="font-medium"> {result.metodePemeriksaan || 'Tidak tersedia'}</span>
                                            </p>
                                            <p className="text-white/70 mt-2">Nilai Normal: 
                                                <span className="font-medium"> {result.nilaiNormal || 'Tidak tersedia'}</span>
                                            </p>
                                            <p className="text-white/70 mt-2">IVA Test: 
                                                <span className={`font-medium ${result.ivaTest === 'Positif' ? 'text-red-400' : 'text-green-400'}`}>
                                                    {result.ivaTest || 'Tidak tersedia'}
                                                </span>
                                            </p>
                                            <p className="text-white/70 mt-2">Sadanis: 
                                                <span className="font-medium"> {result.sadanis || 'Tidak tersedia'}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 mt-4">
                                <div className="flex justify-center mb-4">
                                    <Activity className="text-white/40 mx-auto" size={60} />
                                </div>
                                <p className="text-white/70 text-lg">Belum ada hasil pemeriksaan lab</p>
                                <p className="text-white/50 text-sm mt-2">Silakan perbarui data jika sudah tersedia.</p>
                            </div>
                        )}
                    </div>

                    {/* Hasil Lab */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-[#FF2DF1] to-[#A5158C] rounded-lg">
                                <TestTube className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white">Hasil Pemeriksaan Laboratorium</h4>
                        </div>

                        {hasLabResults ? (
                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                {patientData.hasilPemeriksaanLab.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-5 bg-white/5 rounded-xl border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-white font-semibold text-lg">
                                                {result.jenisPemeriksaan || 'Jenis Tes Tidak Diketahui'}
                                            </h5>
                                            <span className="text-xs text-white/60">
                                                {result.createdAt ? formatDate(result.createdAt) : 'Tanggal Tidak Tersedia'}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#FF2DF1]"></span> Sub Type 16:
                                                <span className="font-medium ml-1">{result.subType16 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#F6DC43]"></span> Sub Type 18:
                                                <span className="font-medium ml-1">{result.subType18 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#A5158C]"></span> Sub Type 52:
                                                <span className="font-medium ml-1">{result.subType52 ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            <p className="text-white/90 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#410445]"></span> Sub Type Lainnya:
                                                <span className="font-medium ml-1">{result.subTypeLainnya ?? 'Tidak ada hasil'}</span>
                                            </p>
                                            
                                            <p className="text-white/70 mt-2">Metode: 
                                                <span className="font-medium"> {result.metodePemeriksaan || 'Tidak tersedia'}</span>
                                            </p>
                                            <p className="text-white/70 mt-2">Nilai Normal: 
                                                <span className="font-medium"> {result.nilaiNormal || 'Tidak tersedia'}</span>
                                            </p>
                                            <p className="text-white/70 mt-2">IVA Test: 
                                                <span className={`font-medium ${result.ivaTest === 'Positif' ? 'text-red-400' : 'text-green-400'}`}>
                                                    {result.ivaTest || 'Tidak tersedia'}
                                                </span>
                                            </p>
                                            <p className="text-white/70 mt-2">Sadanis: 
                                                <span className="font-medium"> {result.sadanis || 'Tidak tersedia'}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 mt-4">
                                <div className="flex justify-center mb-4">
                                    <Activity className="text-white/40 mx-auto" size={60} />
                                </div>
                                <p className="text-white/70 text-lg">Belum ada hasil pemeriksaan lab</p>
                                <p className="text-white/50 text-sm mt-2">Silakan perbarui data jika sudah tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
    );
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#410445] via-[#A5158C] to-[#FF2DF1] p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pt-4">
                    <button
                        onClick={handleBack}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Hasil Pemeriksaan Lengkap</h1>
                        <p className="text-[#F6DC43] text-lg">{patientData?.nama || 'Pasien'}</p>
                    </div>
                </div>

                {/* Patient Summary Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#F6DC43] to-[#FF2DF1] rounded-full flex items-center justify-center shadow-xl">
                            <User className="text-[#410445]" size={48} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {patientData?.nama || 'Nama Tidak Tersedia'}
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80">
                                <span>NIK: {patientData?.nik}</span>
                                <span>•</span>
                                <span>Usia: {calculateAge(patientData?.tanggalLahir)} tahun</span>
                                <span>•</span>
                                <span>ID: {patientData?.id}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                            <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                Data Lengkap
                            </div>
                            <div className="text-white/60 text-sm">
                                Terakhir update: {formatDate(patientData?.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>

                             {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="flex overflow-x-auto pb-2 border-b border-white/20">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 ${
                                    activeTab === tab.id 
                                        ? 'bg-gradient-to-r from-[#F6DC43] to-[#FF8C00] text-[#410445] rounded-t-xl' 
                                        : 'hover:bg-white/10'
                                }`}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                    {activeTab === 'personal' && renderPersonalTab()}
                    {activeTab === 'identity' && renderIdentityTab()}
                    {activeTab === 'health' && renderHealthTab()}
                    {activeTab === 'family' && renderFamilyTab()}
                    {activeTab === 'complaints' && renderComplaintsTab()}
                    {activeTab === 'results' && renderResultsTab()}
                </div>
            </div>
        </div>
    );
};

export default LihatHasil;