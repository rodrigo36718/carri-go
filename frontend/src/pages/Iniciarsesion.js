import React, { useState } from "react";
import "../styles/components/pages/Iniciarsesion.css";

const Iniciarsesion = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message || "Error al iniciar sesión");
      } else {
        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        setError(false);
        setMensaje("¡Login correcto!");

        // Avisar al App para que actualice el Header y cierre el modal
        if (props.onLoginSuccess) {
          props.onLoginSuccess(data.usuario);
        }
      }
    } catch (err) {
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="inicio-sesion">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mensaje && (
          <p
            style={{
              color: error ? "#ff4d4d" : "#4caf50",
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            {mensaje}
          </p>
        )}

        <button type="submit" className="btn-iniciar" disabled={cargando}>
          {cargando ? "Ingresando..." : "INICIAR SESIÓN"}
        </button>
      </form>

      <p className="texto-registro">¿No tenés una cuenta?</p>

      <button className="btn-crear-cuenta" onClick={props.abrirRegistrarse}>
        Crear una cuenta
      </button>
    </div>
  );
};

export default Iniciarsesion;