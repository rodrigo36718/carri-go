import React, { useState } from "react";

const ModalidadRepartidor = ({ usuario, onUsuarioActualizado, cerrar }) => {
  const [delivery, setDelivery] = useState(Boolean(usuario.modalidad_delivery));
  const [encargos, setEncargos] = useState(Boolean(usuario.modalidad_encargos));
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    if (!delivery && !encargos) {
      setError(true);
      setMensaje("Tenés que mantener al menos una modalidad activa.");
      return;
    }

    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch("http://localhost:3000/api/repartidor/modalidades", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          modalidad_delivery: delivery,
          modalidad_encargos: encargos
        })
      });
      const data = await respuesta.json();

      if (!respuesta.ok || data.error) {
        throw new Error(data.message || "No se pudieron guardar los cambios.");
      }

      onUsuarioActualizado(data.usuario);
      setMensaje("Tus modalidades se actualizaron correctamente.");
      setTimeout(cerrar, 900);
    } catch (err) {
      setError(true);
      setMensaje(err.message || "Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ color: "white", padding: "24px", background: "#111", borderRadius: "12px" }}>
      <h2>Mis modalidades de trabajo</h2>
      <p style={{ color: "#bbb" }}>
        Activá las modalidades en las que querés trabajar. Podés usar las dos con esta misma cuenta.
      </p>

      <form onSubmit={guardar}>
        <label style={{ display: "flex", gap: "10px", alignItems: "center", margin: "18px 0" }}>
          <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
          <span><strong>Delivery</strong><br />Pedidos de restaurantes</span>
        </label>

        <label style={{ display: "flex", gap: "10px", alignItems: "center", margin: "18px 0" }}>
          <input type="checkbox" checked={encargos} onChange={(e) => setEncargos(e.target.checked)} />
          <span><strong>Encargos</strong><br />Compras, mandados y trámites</span>
        </label>

        {mensaje && (
          <p style={{ color: error ? "#ff6262" : "#54c779", fontSize: "14px" }}>{mensaje}</p>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <button type="submit" disabled={cargando} className="btn-registrarse">
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" onClick={cerrar} className="btn-login">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalidadRepartidor;
