'use client';

import axios from 'axios';

interface AdminGruposProps {
  grupos: any[];
  setGrupos: React.Dispatch<React.SetStateAction<any[]>>;
}

const AdminGrupos = ({ grupos, setGrupos }: AdminGruposProps) => {
  const eliminarGrupo = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
      await axios.delete(`${apiUrl}/groups/${id}`);
      setGrupos((prev) => prev.filter((g) => g._id !== id));
    } catch (error) {
      console.error('Error al eliminar grupo', error);
    }
  };

  return (
    <table className="table-auto w-full mb-4">
      <thead>
        <tr>
          <th className="border px-4 py-2">Nombre del Grupo</th>
          <th className="border px-4 py-2">Miembros</th>
          <th className="border px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {grupos.map((grupo) => (
          <tr key={grupo._id}>
            <td className="border px-4 py-2">{grupo.name}</td>
            <td className="border px-4 py-2">{grupo.members.join(', ')}</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => eliminarGrupo(grupo._id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminGrupos;
