import React, { useState, useEffect } from "react";
import "../styles/components/pages/Delivery.css"; // reutilizamos estilos

const MisProductos = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // Cargar productos del restaurante
  useEffect(() => {
    if (usuario?.rol === "restaurante") {
      fetch("http://localhost:3000/api/productos")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            // filtramos solo los del restaurante actual (por ahora mostramos todos)
            setProductos(data.productos || []);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const res = await fetch("http://localhost:3000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message);
      } else {
        setError(false);
        setMensaje("Producto publicado correctamente");
        setNombre("");
        setDescripcion("");
        setPrecio("");
        // Agregamos el nuevo producto a la lista
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
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h2>Acceso restringido</h2>
        <p>Solo los restaurantes pueden acceder a esta sección.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Publicar un plato</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <div className="campo" style={{ marginBottom: "15px" }}>
          <label>Nombre del plato</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", height: "42px", padding: "0 12px" }}
          />
        </div>

        <div className="campo" style={{ marginBottom: "15px" }}>
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div className="campo" style={{ marginBottom: "15px" }}>
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            min="0"
            step="100"
            style={{ width: "100%", height: "42px", padding: "0 12px" }}
          />
        </div>

        {mensaje && (
          <p style={{ color: error ? "#ff4d4d" : "#4caf50", marginBottom: "12px" }}>
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          style={{
            backgroundColor: "#ff711f",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {cargando ? "Publicando..." : "Publicar plato"}
        </button>
      </form>

      <h3>Mis platos publicados</h3>
      {productos.length === 0 ? (
        <p>Todavía no publicaste ningún plato.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {productos.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#1a1a1a",
              }}
            >
              <strong>{p.nombre}</strong> — ${Number(p.precio).toLocaleString("es-AR")}
              <p style={{ margin: "5px 0", color: "#aaa" }}>{p.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MisProductos;