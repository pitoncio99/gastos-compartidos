'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Calculadora = () => {
  const [modoGrupo, setModoGrupo] = useState<'bd' | 'manual'>('manual');
  const [gruposGuardados, setGruposGuardados] = useState<any[]>([]);
  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<string>('');
  const [personas, setPersonas] = useState<string[]>([]);
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

  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreTotales, setNombreTotales] = useState('');

  const formularioRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (modoGrupo === 'bd' && grupoSeleccionadoId) {
      const grupo = gruposGuardados.find((g) => g._id === grupoSeleccionadoId);
      if (grupo) {
        setPersonas(grupo.members);
      } else {
        setPersonas([]);
      }
    }
    if (modoGrupo === 'manual') {
      if (personas.length === 0) {
        setPersonas([]);
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

  const toggleTodosConsumidores = () => {
    if (nuevoProducto.consumidores.length === personas.length) {
      setNuevoProducto((prev) => ({ ...prev, consumidores: [] }));
    } else {
      setNuevoProducto((prev) => ({ ...prev, consumidores: [...personas] }));
    }
  };

  const agregarProducto = () => {
    if (modoEdicion !== null) {
      const actualizados = [...productos];
      actualizados[modoEdicion] = nuevoProducto;
      setProductos(actualizados);
      setModoEdicion(null);
    } else {
      setProductos((prev) => [...prev, nuevoProducto]);
    }
    setNuevoProducto({ nombre: '', precio: 0, consumidores: [] });
  };

  const editarProducto = (index: number) => {
    setNuevoProducto(productos[index]);
    setModoEdicion(index);

    // Scroll automático al formulario
    formularioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const eliminarProducto = (index: number) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularDeudas = () => {
    const deudas: Record<string, number> = {};
    personas.forEach((p) => (deudas[p] = 0));
    productos.forEach((producto) => {
      if (producto.consumidores.length > 0) {
        const montoPorPersona = producto.precio / producto.consumidores.length;
        producto.consumidores.forEach((persona) => {
          deudas[persona] += montoPorPersona;
        });
      }
    });
    return deudas;
  };

  const deudas = calcularDeudas();

  const guardarTotales = async () => {
    if (!nombreTotales) {
      alert('Por favor ingresa un nombre para los totales');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE;
      const response = await fetch(`${apiUrl}/group-totals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreTotales,
          grupoId: grupoSeleccionadoId,
          deudas,
          productos,
        }),
      });

      if (response.ok) {
        alert('Totales guardados con éxito');
        setMostrarModal(false); // Cierra el modal
      } else {
        alert('Hubo un error al guardar los totales');
      }
    } catch (err) {
      console.error('Error al guardar los totales:', err);
      alert('Hubo un error al guardar los totales');
    }
  };

  const tienePersonasValidas = personas.length > 0;
  const puedeAgregarProducto = nuevoProducto.consumidores.length > 0;
  const puedeGuardarTotales = productos.length > 0;

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

      <h2 className="text-2xl font-bold mb-4">Configuración de personas</h2>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${modoGrupo === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => {
            setModoGrupo('manual');
            setGrupoSeleccionadoId('');
            setPersonas([]);
          }}
        >
          Personalizar rápido
        </button>
        <button
          className={`px-4 py-2 rounded ${modoGrupo === 'bd' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => {
            setModoGrupo('bd');
            setPersonas([]);
          }}
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
            placeholder="Escribe nombres separados por comas"
            value={personas.join(', ')}
            onChange={(e) =>
              setPersonas(e.target.value.split(',').map((p) => p.trim()).filter((p) => p))
            }
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

      {tienePersonasValidas && (
        <>
          <h2 className="text-2xl font-bold mb-4">{modoEdicion !== null ? 'Editar producto' : 'Agregar producto'}</h2>

          <div ref={formularioRef}>
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
              <button
                onClick={toggleTodosConsumidores}
                className="mt-2 bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
              >
                {nuevoProducto.consumidores.length === personas.length ? 'Desmarcar todos' : 'Marcar todos'}
              </button>
            </div>

            <button
              onClick={agregarProducto}
              className={`px-4 py-2 rounded ${puedeAgregarProducto ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'}`}
              disabled={!puedeAgregarProducto}
            >
              {modoEdicion !== null ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-semibold mb-2">Productos agregados</h2>
          <ul className="space-y-2 mb-6">
            {productos.map((p, index) => (
              <li key={index} className="border p-2 rounded flex justify-between items-center">
                <div>
                  {p.nombre} - ${p.precio} - Consumido por: {p.consumidores.join(', ')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editarProducto(index)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
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

          <button
            onClick={() => setMostrarModal(true)} // Abre el modal
            className={`mt-4 px-4 py-2 rounded ${puedeGuardarTotales ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700'}`}
            disabled={!puedeGuardarTotales}
          >
            Guardar Totales
          </button>
        </>
      )}

      {/* Modal para ingresar el nombre de los totales */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Guardar Totales</h2>
            <input
              type="text"
              className="border p-2 mb-4 w-full"
              placeholder="Ingrese un nombre para los totales"
              value={nombreTotales}
              onChange={(e) => setNombreTotales(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={guardarTotales}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculadora;
