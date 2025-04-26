'use client';

import { useState } from 'react';
import axios from 'axios';

interface CrearGrupoProps {
  onGrupoCreado: (nuevoGrupo: any) => void;
}

const CrearGrupo = ({ onGrupoCreado }: CrearGrupoProps) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [miembros, setMiembros] = useState('');

  const crearGrupo = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
      const miembrosArray = miembros.split(',').map((m) => m.trim());
      const response = await axios.post(`${apiUrl}/groups`, {
        name: nombreGrupo,
        members: miembrosArray,
      });

      onGrupoCreado(response.data); // Notifica al padre
      setNombreGrupo('');
      setMiembros('');
    } catch (error) {
      console.error('Error al crear grupo:', error);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Crear nuevo grupo</h2>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Nombre del grupo"
        value={nombreGrupo}
        onChange={(e) => setNombreGrupo(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Miembros (separados por coma)"
        value={miembros}
        onChange={(e) => setMiembros(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={crearGrupo}>
        Crear Grupo
      </button>
    </div>
  );
};

export default CrearGrupo;
