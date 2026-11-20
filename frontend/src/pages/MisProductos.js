import React, { useState, useEffect, useRef } from "react";
import "../styles/components/pages/MisProductos.css";

const API_URL = "http://localhost:3001/api";

const MisProductos = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // null = creando, número = editando

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const cargarProductos = () => {
    fetch(`${API_URL}/productos`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProductos(data.productos || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (usuario?.rol === "restaurante") {
      cargarProductos();
    }
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen(null);
    setPreview(null);
    setEditandoId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(true);
      setMensaje("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(true);
      setMensaje("La imagen no puede superar los 5MB");
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setError(false);
    setMensaje("");
  };

  const empezarEdicion = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre || "");
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio || "");
    setPreview(producto.imagen_url || null);
    setImagen(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const body = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
      };

      let res;

      if (editandoId) {
        // EDITAR
        res = await fetch(`${API_URL}/productos/${editandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        // CREAR
        res = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message || "Error al guardar");
      } else {
        setError(false);
        setMensaje(editandoId ? "Plato actualizado correctamente" : "Plato publicado correctamente");
        limpiarFormulario();
        cargarProductos();
      }
    } catch (err) {
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este plato?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.error) {
        alert(data.message || "Error al eliminar");
      } else {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        if (editandoId === id) limpiarFormulario();
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  if (!usuario || usuario.rol !== "restaurante") {
    return (
      <main className="mis-productos-page">
        <div className="acceso-restringido">
          <h2>Acceso restringido</h2>
          <p>Solo los restaurantes pueden acceder a esta sección.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-productos-page">
      <div className="mis-productos-hero">
        <h1>Mis Platos</h1>
        <p>Publicá y administrá los platos de tu restaurante</p>
      </div>

      <div className="mis-productos-contenido">
        {/* FORMULARIO */}
        <div className="form-publicar">
          <h2>{editandoId ? "Editar plato" : "Publicar un plato"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label>Nombre del plato</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Hamburguesa especial"
                required
              />
            </div>

            <div className="campo">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ingredientes, tamaño, etc."
                rows="3"
              />
            </div>

            <div className="campo">
              <label>Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 8500"
                required
                min="0"
                step="100"
              />
            </div>

            <div className="campo">
              <label>Imagen del plato</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "10px 16px",
                    background: "#1f1f1f",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Seleccionar archivo
                </button>
                <span style={{ color: "#888", fontSize: "13px" }}>
                  {imagen ? imagen.name : "Sin archivos seleccionados"}
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImagenChange}
                style={{ display: "none" }}
              />

              {preview && (
                <div className="preview-imagen">
                  <img src={preview} alt="Vista previa" />
                </div>
              )}
            </div>

            {mensaje && (
              <p className={error ? "mensaje-error" : "mensaje-ok"}>{mensaje}</p>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-publicar" disabled={cargando}>
                {cargando
                  ? "Guardando..."
                  : editandoId
                  ? "Guardar cambios"
                  : "Publicar plato"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  style={{
                    flex: 1,
                    height: "46px",
                    background: "transparent",
                    color: "#aaa",
                    border: "1px solid #444",
                    borderRadius: "9px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA DE PLATOS */}
        <div className="lista-platos">
          <h2>Platos publicados</h2>

          {productos.length === 0 ? (
            <p className="sin-platos">Todavía no publicaste ningún plato.</p>
          ) : (
            <div className="platos-grid">
              {productos.map((p) => (
                <div
                  key={p.id}
                  className={`plato-card ${!p.imagen_url ? "sin-imagen" : ""}`}
                >
                  {p.imagen_url && (
                    <div className="plato-imagen">
                      <img src={p.imagen_url} alt={p.nombre} />
                    </div>
                  )}

                  <div className="plato-info">
                    <h3>{p.nombre}</h3>
                    {p.descripcion && <p>{p.descripcion}</p>}
                    <strong>${Number(p.precio).toLocaleString("es-AR")}</strong>

                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        onClick={() => empezarEdicion(p)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          background: "#2a2a2a",
                          color: "#fff",
                          border: "1px solid #444",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          background: "transparent",
                          color: "#ff4d4d",
                          border: "1px solid #ff4d4d55",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MisProductos;