import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, Clock, CheckCircle, Users, Heart, Phone, MapPin, Calendar, Play, Pause, Volume2, VolumeX } from 'lucide-react';


const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [videoStates, setVideoStates] = useState({
    video1: { playing: false, muted: true },
    video2: { playing: false, muted: true }
  });

   const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handleVideoControl = (videoId, action) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [action]: !prev[videoId][action]
      }
    }));
  };

  const symptoms = [
    "Perdarahan di luar siklus haid",
    "Nyeri saat berhubungan intim", 
    "Keputihan yang tidak normal (berwarna, berbau)",
    "Nyeri panggul"
  ];

  const riskFactors = [
    "Hubungan seksual di usia muda",
    "Bergonta-ganti pasangan seksual",
    "Riwayat Infeksi Menular Seksual",
    "Merokok",
    "Sistem imun lemah",
    "Memiliki riwayat keluarga kanker serviks"
  ];

  const preventionMethods = [
    "Deteksi dini dengan HPV DNA Test, IVA Test, atau Papsmear",
    "Vaksinasi HPV (usia 9-14 tahun)",
    "Hidup sehat (tidak merokok, pola makan bergizi)",
    "Berolahraga teratur",
    "Setia pada pasangan"
  ];

  const testRequirements = [
    "Sudah pernah melakukan hubungan seksual",
    "Tidak sedang hamil & tidak menstruasi",
    "Tidak melakukan hubungan seksual 2x24 jam sebelum test",
    "Tidak sedang menggunakan obat per vaginam"
  ];

  const advantages = [
    { icon: <CheckCircle className="w-6 h-6" />, text: "Hasil lebih akurat dari IVA Test dan Papsmear" },
    { icon: <Shield className="w-6 h-6" />, text: "Dapat mendeteksi jenis virus HPV" },
    { icon: <Calendar className="w-6 h-6" />, text: "Dapat dilakukan 3-5 tahun sekali" }
  ];

   useEffect(() => {
    if (videoRef1.current) {
      videoStates.video1.playing 
        ? videoRef1.current.play() 
        : videoRef1.current.pause();
      
      videoRef1.current.muted = videoStates.video1.muted;
    }
    
    if (videoRef2.current) {
      videoStates.video2.playing 
        ? videoRef2.current.play() 
        : videoRef2.current.pause();
      
      videoRef2.current.muted = videoStates.video2.muted;
    }
  }, [videoStates]);

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="flex flex-col items-center justify-center min-h-screen py-16 space-y-12">
          <header className="text-center max-w-5xl">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Selamat Datang di{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-300 to-orange-300 animate-pulse">
                HPV YUU
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-light mb-4">
              Solusi Terbaik untuk Pemeriksaan HPV DNA Test
            </p>
            <p className="text-base sm:text-lg text-pink-200 italic">
              Kanker Serviks DAPAT DICEGAH - Mari Lakukan Deteksi Dini!
            </p>
          </header>

          {/* Hero Image with Enhanced Styling */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative">
              <img 
                src="/logoHpv.png" 
                alt="HPV YUU - Pemeriksaan HPV DNA Test"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 relative z-10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/30 to-transparent z-20"></div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-lg">
            <a 
              href="/identitasPasien" 
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center inline-block group"
            >
              <span className="flex items-center justify-center gap-2">
                Mulai Sekarang
                <Heart className="w-5 h-5 group-hover:animate-pulse" />
              </span>
            </a>
            <a 
              href="/cekNik" 
              className="w-full sm:w-auto border-2 border-pink-300 text-pink-300 hover:bg-pink-300 hover:text-purple-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Cek NIK
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-8">
            <ChevronDown className="w-8 h-8 text-pink-300 opacity-70" />
          </div>
        </div>

        {/* Information Sections */}
        <div className="py-16 space-y-20">
          
          {/* What is Cervical Cancer */}
          <section className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                Apa itu Kanker Serviks?
              </h2>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed text-center max-w-4xl mx-auto mb-8">
                Kanker serviks adalah kanker yang muncul di leher rahim (serviks), bagian bawah rahim yang terhubung ke vagina. 
                Penyebab utamanya adalah infeksi jangka panjang oleh virus HPV (Human Papillomavirus).
              </p>
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl p-6 border-l-4 border-red-400">
                <p className="text-red-200 font-semibold text-center">
                  ⚠️ Pada tahap awal, kanker serviks kerap kali tidak bergejala
                </p>
              </div>
            </div>
          </section>

          {/* HPV DNA Test Information */}
          <section className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Apa itu HPV DNA Test?
              </h2>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-200 leading-relaxed mb-6">
                    HPV DNA Test adalah pemeriksaan medis yang dirancang untuk mendeteksi keberadaan virus Human Papillomavirus (HPV) 
                    dalam tubuh dan mengetahui jenis virus yang menyerang.
                  </p>
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border-l-4 border-green-400">
                    <h3 className="font-bold text-green-200 mb-2">Mengapa Penting?</h3>
                    <p className="text-green-100">
                      Dapat mendeteksi dini adanya infeksi virus penyebab kanker serviks sebelum muncul perubahan sel yang berkembang menjadi kanker.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-pink-300">Kelebihan HPV DNA Test:</h3>
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                      <div className="text-pink-400 mt-1">{advantage.icon}</div>
                      <p className="text-gray-200">{advantage.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Video Testimonials Section */}
          <section className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Video Testimoni & Pemeriksaan
              </h2>
              <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                Saksikan langsung bagaimana pemeriksaan HPV DNA Test dilakukan di sekolah-sekolah dan dengar testimoni dari para peserta
              </p>
              
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Video 1 - Sekolah Cikal */}
                <div className="group">
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-300/20 hover:border-purple-300/40 transition-all duration-500">
                    <h3 className="text-xl sm:text-2xl font-bold text-pink-300 mb-4 text-center">
                      Pemeriksaan HPV DNA di Sekolah Cikal
                    </h3>
                    
                    <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl">
                      <video
                      ref={videoRef1}
                        className="w-full h-full object-cover"
                        src="/pemeriksaan-cikal.mp4"
                        poster="/video-poster-1.jpg"
                        playsInline
                        loop
                        
                      />
                      
                      {/* Custom Video Controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <button
                            onClick={() => handleVideoControl('video1', 'playing')}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            {videoStates.video1.playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </button>
                          
                          <button
                            onClick={() => handleVideoControl('video1', 'muted')}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            {videoStates.video1.muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Play Button Overlay */}
                      {!videoStates.video1.playing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <button
                            onClick={() => handleVideoControl('video1', 'playing')}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 group"
                          >
                            <Play className="w-12 h-12 ml-1 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 bg-white/5 rounded-xl p-4">
                      <p className="text-gray-300 text-center text-sm">
                        📍 Dokumentasi pemeriksaan HPV DNA Test dan testimoni langsung dari siswa-siswi Sekolah Cikal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video 2 - Sekolah High Scope */}
                <div className="group">
                  <div className="relative bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-2xl p-6 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-500">
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-300 mb-4 text-center">
                      Pemeriksaan HPV DNA di Sekolah High Scope
                    </h3>
                    
                    <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl">
                      <video
                      ref={videoRef2}
                        className="w-full h-full object-cover"
                        src="/pemeriksaan-highscope.mp4"
                        poster="/video-poster-2.jpg"
                        playsInline
                         loop
                      />
                      
                      {/* Custom Video Controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <button
                            onClick={() => handleVideoControl('video2', 'playing')}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            {videoStates.video2.playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </button>
                          
                          <button
                            onClick={() => handleVideoControl('video2', 'muted')}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                          >
                            {videoStates.video2.muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Play Button Overlay */}
                      {!videoStates.video2.playing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <button
                            onClick={() => handleVideoControl('video2', 'playing')}
                            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white p-6 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 group"
                          >
                            <Play className="w-12 h-12 ml-1 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 bg-white/5 rounded-xl p-4">
                      <p className="text-gray-300 text-center text-sm">
                        📍 Proses pemeriksaan HPV DNA Test di lingkungan Sekolah High Scope
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Benefits */}
              <div className="mt-12 grid sm:grid-cols-3 gap-6">
                <div className="text-center bg-white/5 rounded-xl p-6">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-pink-300 mb-2">Testimoni Nyata</h4>
                  <p className="text-gray-400 text-sm">Dengar langsung pengalaman dari peserta pemeriksaan</p>
                </div>
                
                <div className="text-center bg-white/5 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-300 mb-2">Proses Aman</h4>
                  <p className="text-gray-400 text-sm">Lihat bagaimana pemeriksaan dilakukan dengan aman</p>
                </div>
                
                <div className="text-center bg-white/5 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-green-300 mb-2">Terpercaya</h4>
                  <p className="text-gray-400 text-sm">Pemeriksaan dilakukan oleh tenaga medis profesional</p>
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-yellow-300">
                Informasi Penting
              </h2>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: 'overview', label: 'Ringkasan', icon: <Heart className="w-4 h-4" /> },
                  { id: 'symptoms', label: 'Gejala', icon: <Shield className="w-4 h-4" /> },
                  { id: 'risks', label: 'Faktor Risiko', icon: <Users className="w-4 h-4" /> },
                  { id: 'prevention', label: 'Pencegahan', icon: <CheckCircle className="w-4 h-4" /> },
                  { id: 'requirements', label: 'Syarat Test', icon: <Clock className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Who needs HPV DNA Test section */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-300/20">
                      <h3 className="text-2xl font-bold text-pink-300 mb-6 text-center">
                        Siapa yang perlu melakukan HPV DNA test?
                      </h3>
                      <div className="text-center space-y-4">
                        <div className="bg-white/10 rounded-xl p-6">
                          <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                          <p className="text-lg text-gray-200 font-semibold mb-2">
                            Wanita usia 20-65 tahun atau yang sudah pernah melakukan hubungan seksual
                          </p>
                          <p className="text-pink-300 font-bold">
                            Memiliki faktor resiko tinggi
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional overview information */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6">
                        <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-center">Frekuensi</h3>
                        <p className="text-gray-300 text-center">Dapat dilakukan 3-5 tahun sekali</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6">
                        <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-center">Akurasi</h3>
                        <p className="text-gray-300 text-center">Lebih akurat dari IVA Test dan Papsmear</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'symptoms' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-red-300">Gejala Kanker Serviks</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center gap-3 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                          <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-200">{symptom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-orange-300">Faktor Risiko</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-center gap-3 bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                          <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-200">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'prevention' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-green-300">Cara Pencegahan</h3>
                    <div className="space-y-4">
                      {preventionMethods.map((method, index) => (
                        <div key={index} className="flex items-start gap-3 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-200">{method}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-blue-300">Syarat HPV DNA Test</h3>
                    <div className="space-y-4">
                      {testRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <p className="text-gray-200">{requirement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-purple-300/20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-purple-200">
                Info Lebih Lanjut
              </h2>
              <div className="text-center space-y-6">
                <h3 className="text-xl font-bold text-pink-300">Puskesmas Pembantu Cilandak Barat</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-pink-400" />
                    <span>Jl. Sakura No. 127 RT 004 RW 007, Kel. Cilandak Barat Kec. Cilandak</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="tel:+6281385657569" 
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    +62 813-8565-7569
                  </a>
                  <span className="text-pink-300 font-semibold">Puskesmascilandakbarat</span>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
                Yuk Lakukan HPV DNA Test!
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Jangan tunggu sampai terlambat. Deteksi dini adalah kunci pencegahan terbaik.
              </p>
              <a 
                href="/identitasPasien" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-black font-bold py-6 px-12 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6" />
                Daftar Sekarang
                <Heart className="w-6 h-6" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;