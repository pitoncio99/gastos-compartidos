'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGrupos from '../components/AdminGrupos';
import CrearGrupo from '../components/CrearGrupo';

const AdminGruposPage = () => {
  const [grupos, setGrupos] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
        const response = await fetch(`${apiUrl}/groups`);
        const data = await response.json();
        setGrupos(data);
      } catch (err) {
        console.error('Error al cargar grupos:', err);
      }
    };

    fetchGrupos();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Grupos</h1>
        <Link href="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Volver a Calculadora
          </button>
        </Link>
      </div>

      <CrearGrupo onGrupoCreado={(nuevoGrupo) => setGrupos((prev) => [...prev, nuevoGrupo])} />

      <AdminGrupos grupos={grupos} setGrupos={setGrupos} />
    </div>
  );
};

export default AdminGruposPage;
