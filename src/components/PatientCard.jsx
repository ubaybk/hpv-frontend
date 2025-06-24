// src/components/PatientCard.jsx
import { useState } from "react";

const PatientCard = ({ patient }) => {
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="p-4 bg-[#A5158C] text-white">
                <h2 className="text-xl font-semibold">{patient.nama}</h2>
                <p>NIK: {patient.nik}</p>
            </div>

            <div className="p-4">
                <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="w-full py-2 mt-2 bg-[#410445] text-white rounded hover:bg-[#A5158C] transition"
                >
                    {showDetail ? "Sembunyikan Detail" : "Lihat Detail"}
                </button>

                {showDetail && (
                    <div className="mt-4 space-y-2 text-sm text-gray-700 border-t pt-2">
                        <p><strong>Alamat:</strong> {patient.alamat}, {patient.kelurahan}, {patient.kecamatan}, {patient.kota}</p>
                        <p><strong>Tanggal Lahir:</strong> {new Date(patient.tanggalLahir).toLocaleDateString()}</p>
                        <p><strong>No HP:</strong> {patient.noHp}</p>
                        <p><strong>Berat/Tinggi:</strong> {patient.beratBadan} kg / {patient.tinggiBadan} cm</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientCard;