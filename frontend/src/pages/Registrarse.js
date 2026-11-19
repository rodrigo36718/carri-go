import React, { useState } from "react";
import "../styles/components/pages/Registrarse.css";

const Registrarse = (props) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rol, setRol] = useState("cliente");
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

    setCargando(true);

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          rol,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message || "Error al registrarse");
      } else {
        setError(false);
        setMensaje("Usuario registrado correctamente. Ya podés iniciar sesión.");
        // Limpiar formulario
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
        setConfirmar("");
        setRol("cliente");
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
            style={{
              width: "100%",
              height: "42px",
              backgroundColor: "#101010",
              color: "white",
              border: "1px solid #333",
              borderRadius: "7px",
              padding: "0 13px",
            }}
          >
            <option value="cliente">Cliente</option>
            <option value="restaurante">Restaurante</option>
            <option value="repartidor">Repartidor</option>
          </select>
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