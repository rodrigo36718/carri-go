import React from "react";
import Nav from "./Nav";
import "../../styles/components/layout/Header.css";

const Header = (props) => {
  return (
    <header className="header">
      <div className="header-contenido">
        <div className="logo">
          <img src="/img/logo.png" alt="Carri-GO" />
          <h1>Carri-GO</h1>
        </div>

        <Nav />

        <div className="usuario">
          {props.usuario ? (
            <>
              <span style={{ color: "white", marginRight: "12px", fontSize: "14px" }}>
                Hola, {props.usuario.nombre}
              </span>
              {props.usuario.rol === "repartidor" && (
                <button className="btn-login" onClick={props.abrirPerfil}>
                  Mis modalidades
                </button>
              )}
              <button className="btn-login" onClick={props.onLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={props.abrirIniciarSesion}>
                Iniciar sesión
              </button>
              <button className="btn-registro" onClick={props.abrirRegistrarse}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
