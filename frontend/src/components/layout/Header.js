import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "../../styles/components/layout/Header.css";

const Header = (props) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-contenido">
        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src="/img/logo.png" alt="Carri-GO" />
          <h1>Carri-GO</h1>
        </div>

        {/* NAVEGACIÓN */}
        <Nav />

        {/* USUARIO */}
        <div className="usuario">
          {props.usuario ? (
            <>
              <span
                style={{
                  color: "white",
                  marginRight: "12px",
                  fontSize: "14px",
                }}
              >
                Hola, {props.usuario.nombre}
              </span>

              {/* Solo para RESTAURANTE */}
              {props.usuario.rol === "restaurante" && (
                <button
                  className="btn-login"
                  onClick={() => navigate("/MisProductos")}
                  style={{ marginRight: "8px" }}
                >
                  Mis Platos
                </button>
              )}

              {/* Solo para REPARTIDOR */}
              {props.usuario.rol === "repartidor" && (
                <button
                  className="btn-login"
                  onClick={() => navigate("/MiServicio")}
                  style={{ marginRight: "8px" }}
                >
                  Mi Servicio
                </button>
              )}

              <button className="btn-login" onClick={props.onLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-login"
                onClick={props.abrirIniciarSesion}
              >
                Iniciar sesión
              </button>

              <button
                className="btn-registro"
                onClick={props.abrirRegistrarse}
              >
                Registrarse
              </button>
            </>
          )}

          <button className="perfil" aria-label="Perfil">
            👤
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;