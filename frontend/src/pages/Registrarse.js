import React, { useState } from "react";
import "../styles/components/pages/Registrarse.css";

const Registrarse = (props) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rol, setRol] = useState("cliente");
  const [modalidadDelivery, setModalidadDelivery] = useState(true);
  const [modalidadEncargos, setModalidadEncargos] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    if (password !== confirmar) {
      setError(true);
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError(true);
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (rol === "repartidor" && !modalidadDelivery && !modalidadEncargos) {
      setError(true);
      setMensaje("Seleccioná al menos una modalidad de repartidor");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          rol,
          modalidad_delivery: rol === "repartidor" ? modalidadDelivery : false,
          modalidad_encargos: rol === "repartidor" ? modalidadEncargos : false,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(true);
        setMensaje(data.message || "Error al registrarse");
      } else {
        setError(false);
        setMensaje("Usuario registrado correctamente. Ya podés iniciar sesión.");
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
        setConfirmar("");
        setRol("cliente");
        setModalidadDelivery(true);
        setModalidadEncargos(true);
      }
    } catch (err) {
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro">
      <h2>Crear una cuenta</h2>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            placeholder="Tu apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="email-registro">Correo electrónico</label>
          <input
            type="email"
            id="email-registro"
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password-registro">Contraseña</label>
          <input
            type="password"
            id="password-registro"
            placeholder="Crear contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="confirmar-password">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmar-password"
            placeholder="Repetir contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="rol">Tipo de cuenta</label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="select-rol"
          >
            <option value="cliente">Cliente</option>
            <option value="restaurante">Restaurante</option>
            <option value="repartidor">Repartidor</option>
          </select>
        </div>

        {rol === "repartidor" && (
          <div className="campo modalidades">
            <label>Modalidades de trabajo</label>
            <p className="modalidades-ayuda">
              Elegí una o las dos. Podés trabajar con la misma cuenta.
            </p>

            <div className="modalidades-grid">
              <button
                type="button"
                className={`modalidad-card ${modalidadDelivery ? "activa" : ""}`}
                onClick={() => setModalidadDelivery(!modalidadDelivery)}
              >
                <span className="modalidad-check">
                  {modalidadDelivery ? "✓" : ""}
                </span>
                <span className="modalidad-texto">
                  <strong>Delivery</strong>
                  <small>Pedidos de restaurantes</small>
                </span>
              </button>

              <button
                type="button"
                className={`modalidad-card ${modalidadEncargos ? "activa" : ""}`}
                onClick={() => setModalidadEncargos(!modalidadEncargos)}
              >
                <span className="modalidad-check">
                  {modalidadEncargos ? "✓" : ""}
                </span>
                <span className="modalidad-texto">
                  <strong>Encargos</strong>
                  <small>Compras, mandados y trámites</small>
                </span>
              </button>
            </div>
          </div>
        )}

        {mensaje && (
          <p className={error ? "mensaje-error" : "mensaje-ok"}>{mensaje}</p>
        )}

        <button type="submit" className="btn-registrarse" disabled={cargando}>
          {cargando ? "Registrando..." : "REGISTRARSE"}
        </button>
      </form>

      <p className="texto-registro">¿Ya tenés una cuenta?</p>
      <button className="btn-crear-cuenta" onClick={props.abrirIniciarSesion}>
        Iniciar sesión
      </button>
    </div>
  );
};

export default Registrarse;