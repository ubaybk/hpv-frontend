import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-purple-900 to-pink-600 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-16 space-y-16">
          
          {/* Header Section */}
          <header className="text-center max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Selamat Datang di{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300">
                HPV YUU
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-light">
              Solusi Terbaik untuk Pemeriksaan HPV DNA Test
            </p>
          </header>

          {/* Hero Image */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              <img 
                src="/logoHpv.png" 
                alt="HPV YUU - Pemeriksaan HPV DNA Test"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/20 to-transparent"></div>
            </div>
          </div>

          {/* Information Section */}
          <section className="text-center max-w-4xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-pink-200">
              Apa itu HPV DNA Test?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed">
              HPV DNA Test adalah pemeriksaan medis yang dirancang untuk mendeteksi 
              keberadaan virus Human Papillomavirus (HPV) dalam tubuh. Tes ini sangat 
              penting karena beberapa jenis HPV dapat menyebabkan kanker serviks dan 
              penyakit lainnya.
            </p>
          </section>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <a 
              href="/identitasPasien" 
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center inline-block"
            >
              Mulai Sekarang
            </a>
            <button className="w-full sm:w-auto border-2 border-pink-300 text-pink-300 hover:bg-pink-300 hover:text-purple-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300">
              Cek NIK
            </button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Akurat</h3>
              <p className="text-sm text-gray-300 text-center">Hasil pemeriksaan yang akurat dan terpercaya</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Cepat</h3>
              <p className="text-sm text-gray-300 text-center">Proses pemeriksaan yang cepat dan efisien</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Aman</h3>
              <p className="text-sm text-gray-300 text-center">Data pasien terjamin keamanannya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;