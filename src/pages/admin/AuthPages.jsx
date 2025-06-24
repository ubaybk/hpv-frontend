import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    tempat_tugas: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            nama: formData.nama,
            email: formData.email,
            password: formData.password,
            tempat_tugas: formData.tempat_tugas
          };

      if (!isLogin && formData.password !== formData.confirmPassword) {
        showToast('Password tidak cocok!', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

    if (response.ok) {
  showToast(
    isLogin ? 'Login berhasil! Selamat datang!' : 'Registrasi berhasil!',
    'success'
  );

  // Simpan token ke localStorage jika login
  if (isLogin && data.token) {
    localStorage.setItem('access_token', data.token);
  }

  setFormData({ nama: '', email: '', password: '', confirmPassword: '', tempat_tugas: '' });

  if (isLogin) {
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  }
}
else {
        showToast(data.message || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      showToast('Gagal menghubungi server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ nama: '', email: '', password: '', confirmPassword: '', tempat_tugas: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500 flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              {isLogin ? (
                <LogIn className="w-10 h-10 text-white" />
              ) : (
                <UserPlus className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Selamat Datang!' : 'Daftar Akun'}
            </h1>
            <p className="text-white/80 text-sm">
              {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru Anda'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Nama Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Nama</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>
            )}

            {/* Tempat Tugas Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Tempat Tugas</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    name="tempat_tugas"
                    value={formData.tempat_tugas}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Masukkan tempat tugas"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Konfirmasi password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Masuk...' : 'Mendaftar...'}
                </div>
              ) : (
                isLogin ? 'Masuk' : 'Daftar'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 text-center">
            <p className="text-white/80 text-sm">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button
                onClick={toggleForm}
                className="ml-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                {isLogin ? 'Daftar disini' : 'Masuk disini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;