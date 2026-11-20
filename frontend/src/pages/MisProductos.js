import React, { useState, useEffect } from "react";
import "../styles/components/pages/MisProductos.css";

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

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    if (usuario?.rol === "restaurante") {
      fetch("http://localhost:3000/api/productos")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setProductos(data.productos || []);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const res = await fetch("http://localhost:3000/api/productos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NO pongas Content-Type: el navegador lo setea solo con FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message);
      } else {
        setError(false);
        setMensaje("Plato publicado correctamente");
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setImagen(null);
        setPreview(null);
        setProductos((prev) => [data.producto, ...prev]);
      }
    } catch (err) {
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
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
      <section className="mis-productos-hero">
        <h1>Mis Platos</h1>
        <p>Publicá los platos de tu restaurante</p>
      </section>

      <section className="mis-productos-contenido">
        <div className="form-publicar">
          <h2>Publicar un plato</h2>

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
                placeholder="8500"
                required
                min="0"
                step="100"
              />
            </div>

            <div className="campo">
              <label>Imagen del plato</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagen}
              />
              {preview && (
                <div className="preview-imagen">
                  <img src={preview} alt="Vista previa" />
                </div>
              )}
            </div>

            {mensaje && (
              <p className={error ? "mensaje-error" : "mensaje-ok"}>
                {mensaje}
              </p>
            )}

            <button type="submit" className="btn-publicar" disabled={cargando}>
              {cargando ? "Publicando..." : "Publicar plato"}
            </button>
          </form>
        </div>

        <div className="lista-platos">
          <h2>Platos publicados</h2>

          {productos.length === 0 ? (
            <p className="sin-platos">Todavía no publicaste ningún plato.</p>
          ) : (
            <div className="platos-grid">
              {productos.map((p) => (
                <article className="plato-card" key={p.id}>
                  <div className="plato-imagen">
                    <img
                      src={p.imagen_url || "/img/Hamburguesa2.jpg"}
                      alt={p.nombre}
                    />
                  </div>
                  <div className="plato-info">
                    <h3>{p.nombre}</h3>
                    <p>{p.descripcion || "Sin descripción"}</p>
                    <strong>
                      ${Number(p.precio).toLocaleString("es-AR")}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MisProductos;