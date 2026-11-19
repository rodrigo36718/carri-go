import React, { useState, useEffect } from "react";

const MiServicio = () => {
  const [vehiculo, setVehiculo] = useState("moto");
  const [capacidad, setCapacidad] = useState("");
  const [zona, setZona] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const res = await fetch("http://localhost:3000/api/servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehiculo,
          capacidad,
          zona,
          telefono,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message);
      } else {
        setError(false);
        setMensaje("Servicio publicado correctamente");
      }
    } catch (err) {
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario || usuario.rol !== "repartidor") {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h2>Acceso restringido</h2>
        <p>Solo los repartidores pueden acceder a esta sección.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Publicar mi servicio de encargos</h2>
      <p style={{ color: "#aaa", marginBottom: "25px" }}>
        Completá tus datos para que los clientes puedan contratarte.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Vehículo</label>
          <select
            value={vehiculo}
            onChange={(e) => setVehiculo(e.target.value)}
            style={{
              width: "100%",
              height: "42px",
              backgroundColor: "#101010",
              color: "white",
              border: "1px solid #333",
              borderRadius: "7px",
              padding: "0 12px",
            }}
          >
            <option value="moto">Moto</option>
            <option value="auto">Auto</option>
            <option value="bicicleta">Bicicleta</option>
            <option value="a pie">A pie</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Capacidad (ej: hasta 15 kg)</label>
          <input
            type="text"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            placeholder="hasta 15 kg / paquetes medianos"
            style={{ width: "100%", height: "42px", padding: "0 12px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Zona donde trabajás</label>
          <input
            type="text"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Centro, Palermo, etc."
            style={{ width: "100%", height: "42px", padding: "0 12px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Teléfono de contacto</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="1122334455"
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
            width: "100%",
          }}
        >
          {cargando ? "Publicando..." : "Publicar servicio"}
        </button>
      </form>
    </main>
  );
};

export default MiServicio;