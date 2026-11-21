import React, { useState, useEffect } from "react";
import "../styles/components/pages/Encargos.css";

const API = "http://localhost:3001";

const Encargos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/servicios`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setServicios(data.servicios || []);
        }
      })
      .catch(() => setServicios([]))
      .finally(() => setCargando(false));
  }, []);

  const iconoVehiculo = (vehiculo) => {
    const v = (vehiculo || "").toLowerCase();
    if (v.includes("moto")) return "🏍️";
    if (v.includes("auto")) return "🚗";
    if (v.includes("bici")) return "🚲";
    if (v.includes("pie")) return "🚶";
    return "📦";
  };

  const serviciosFiltrados = servicios.filter((s) => {
    const texto = `${s.nombre || ""} ${s.apellido || ""} ${s.zona || ""} ${
      s.vehiculo || ""
    }`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <main className="encargos-page">
      <section className="encargos-hero">
        <img src="/img/fondodeencargo.jpg" alt="Servicio de encargos" />
        <div className="encargos-hero-overlay"></div>
        <div className="encargos-hero-content">
          <h1>
            ¿Necesitás que alguien
            <br />
            vaya a buscar algo?
          </h1>
          <p>
            Contratá un repartidor para realizar tu encargo de forma rápida y
            sencilla.
          </p>
        </div>
      </section>

      <section className="busqueda-encargos">
        <div className="busqueda-encargos-box">
          <input
            type="text"
            placeholder="Buscar por zona, nombre o vehículo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>

      <section className="repartidores">
        {cargando ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
            Cargando repartidores...
          </p>
        ) : (
          <div className="repartidores-grid">
            {serviciosFiltrados.map((s) => (
              <article className="repartidor" key={s.id}>
                <div className="repartidor-foto">
                  <img
                    src={s.imagen_url || "/img/repartidor1.jpg"}
                    alt={`${s.nombre || ""} ${s.apellido || ""}`}
                  />
                </div>

                <div className="repartidor-info">
                  <h3>
                    {(s.nombre || "Repartidor").toUpperCase()}{" "}
                    {(s.apellido || "").toUpperCase()}
                  </h3>

                  <p>📍 {s.zona || "Zona no especificada"}</p>
                  <p>
                    {iconoVehiculo(s.vehiculo)} {s.vehiculo || "Vehículo"}
                  </p>
                  {s.capacidad && <p>📦 {s.capacidad}</p>}

                  <div className="repartidor-bottom">
                    <span className="estrellas">★★★★★</span>
                    <span>{s.telefono || "Sin teléfono"}</span>
                  </div>

                  <button className="btn-elegir">Pedir encargo</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!cargando && serviciosFiltrados.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#aaa",
            }}
          >
            {servicios.length === 0
              ? "Todavía no hay repartidores disponibles."
              : "No encontramos repartidores con esa búsqueda."}
          </p>
        )}
      </section>
    </main>
  );
};

export default Encargos;