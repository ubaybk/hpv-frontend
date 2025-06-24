// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientCard from "../../components/PatientCard"
import { isAuthenticated } from "../../utils/auth"

const Dashboard = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cek autentikasi
        if (!isAuthenticated()) {
            navigate("/login"); // Arahkan ke halaman login jika tidak ada token
        }

        // Ambil data pasien
        fetch("http://localhost:3000/api/pasien/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Gagal mengambil data");
                return res.json();
            })
            .then((data) => {
                setPatients(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [navigate]);

    if (loading) return <div className="text-center py-10">Memuat data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F6DC43] to-[#f9f9f9] p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#410445] mb-6">Dashboard Pasien</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;