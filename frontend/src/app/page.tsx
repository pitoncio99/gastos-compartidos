'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Calculadora = () => {
  const [modoGrupo, setModoGrupo] = useState<'bd' | 'manual'>('manual'); // 'bd' o 'manual'
  const [gruposGuardados, setGruposGuardados] = useState<any[]>([]); 
  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<string>('');
  const [personas, setPersonas] = useState<string[]>(['A', 'B', 'C', 'D']);
  const [productos, setProductos] = useState<{
    nombre: string;
    precio: number;
    consumidores: string[];
  }[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: 0,
    consumidores: [] as string[],
  });

  // Cargar grupos al iniciar si es necesario
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
        const response = await fetch(`${apiUrl}/groups`);
        const data = await response.json();
        setGruposGuardados(data);
      } catch (err) {
        console.error('Error al cargar grupos:', err);
      }
    };

    fetchGrupos();
  }, []);

  // Cuando se selecciona un grupo, actualizar las personas
  useEffect(() => {
    if (modoGrupo === 'bd' && grupoSeleccionadoId) {
      const grupo = gruposGuardados.find((g) => g._id === grupoSeleccionadoId);
      if (grupo) {
        setPersonas(grupo.members); // Cambié "personas" a "members" según el JSON de tu respuesta
      }
    }
  }, [grupoSeleccionadoId, gruposGuardados, modoGrupo]);

  const toggleConsumidor = (nombre: string) => {
    setNuevoProducto((prev) => ({
      ...prev,
      consumidores: prev.consumidores.includes(nombre)
        ? prev.consumidores.filter((n) => n !== nombre)
        : [...prev.consumidores, nombre],
    }));
  };

  const agregarProducto = () => {
    setProductos((prev) => [...prev, nuevoProducto]);
    setNuevoProducto({ nombre: '', precio: 0, consumidores: [] });
  };

  const calcularDeudas = () => {
    const deudas: Record<string, number> = {};
    personas.forEach((p) => (deudas[p] = 0));

    productos.forEach((producto) => {
      const montoPorPersona = producto.precio / producto.consumidores.length;
      producto.consumidores.forEach((persona) => {
        deudas[persona] += montoPorPersona;
      });
    });

    return deudas;
  };

  const deudas = calcularDeudas();

  // Función para guardar los totales
  const guardarTotales = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
      const response = await fetch(`${apiUrl}/group-totals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grupoId: grupoSeleccionadoId,
          deudas,
          productos,
        }),
      });

      if (response.ok) {
        alert('Totales guardados con éxito');
      } else {
        alert('Hubo un error al guardar los totales');
      }
    } catch (err) {
      console.error('Error al guardar los totales:', err);
      alert('Hubo un error al guardar los totales');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Calculadora</h1>
        <Link href="/admin-grupos" passHref>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Administrar Grupos
          </button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Configuración de personas</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${modoGrupo === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setModoGrupo('manual')}
        >
          Personalizar rápido
        </button>
        <button
          className={`px-4 py-2 rounded ${modoGrupo === 'bd' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setModoGrupo('bd')}
        >
          Usar grupo guardado
        </button>
      </div>

      {modoGrupo === 'manual' ? (
        <div className="mb-4">
          <label className="block">Personas:</label>
          <input
            type="text"
            className="border p-2 mb-2 w-full"
            placeholder="Escribe nombres de personas separados por comas"
            value={personas.join(', ')}
            onChange={(e) => setPersonas(e.target.value.split(',').map((p) => p.trim()))}
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block mb-2">Selecciona un grupo guardado:</label>
          <select
            className="border p-2 w-full"
            value={grupoSeleccionadoId}
            onChange={(e) => setGrupoSeleccionadoId(e.target.value)}
          >
            <option value="">-- Selecciona un grupo --</option>
            {gruposGuardados.map((grupo) => (
              <option key={grupo._id} value={grupo._id}>
                {grupo.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Agregar producto</h1>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Nombre del producto"
        value={nuevoProducto.nombre}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
      />
      <input
        type="number"
        className="border p-2 mb-2 w-full"
        placeholder="Precio"
        value={nuevoProducto.precio || ''}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: Number(e.target.value) })}
      />

      <div className="mb-4">
        <span className="font-semibold">¿Quiénes lo consumieron?</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {personas.map((nombre) => (
            <label key={nombre} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={nuevoProducto.consumidores.includes(nombre)}
                onChange={() => toggleConsumidor(nombre)}
              />
              {nombre}
            </label>
          ))}
        </div>
      </div>

      <button onClick={agregarProducto} className="bg-blue-500 text-white px-4 py-2 rounded">
        Agregar
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Productos agregados</h2>
      <ul className="space-y-2 mb-6">
        {productos.map((p, index) => (
          <li key={index} className="border p-2 rounded">
            {p.nombre} - ${p.precio} - Consumido por: {p.consumidores.join(', ')}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Total por persona</h2>
      <ul className="space-y-1">
        {personas.map((persona) => (
          <li key={persona} className="text-gray-800">
            {persona}: ${deudas[persona].toFixed(0)}
          </li>
        ))}
      </ul>

      {/* Botón para guardar los totales */}
      <button
        onClick={guardarTotales}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Guardar Totales
      </button>
    </div>
  );
};

export default Calculadora;
