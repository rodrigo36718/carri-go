import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Inicio from "./pages/Inicio";
import Delivery from "./pages/Delivery";
import Encargos from "./pages/Encargos";
import Repartidores from "./pages/Repartidores";
import Iniciarsesion from "./pages/Iniciarsesion";
import Registrarse from "./pages/Registrarse";
import ModalidadRepartidor from "./pages/ModalidadRepartidor";
import MisProductos from "./pages/MisProductos";
import MiServicio from "./pages/MiServicio";

import "./App.css";

function App() {
  const [ventana, setVentana] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const handleLoginSuccess = (usuarioLogueado) => {
    setUsuario(usuarioLogueado);
    setVentana(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header
          usuario={usuario}
          onLogout={handleLogout}
          abrirIniciarSesion={() => setVentana("login")}
          abrirRegistrarse={() => setVentana("registro")}
          abrirPerfil={() => setVentana("modalidades")}
        />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Delivery" element={<Delivery />} />
          <Route path="/Encargos" element={<Encargos />} />
          <Route path="/Repartidores" element={<Repartidores />} />
          <Route path="/MisProductos" element={<MisProductos />} />
          <Route path="/MiServicio" element={<MiServicio />} />
        </Routes>

        <Footer />
      </BrowserRouter>

      {ventana !== null && (
        <div className="modal-fondo" onClick={() => setVentana(null)}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            {ventana === "login" && (
              <Iniciarsesion
                onLoginSuccess={handleLoginSuccess}
                abrirRegistrarse={() => setVentana("registro")}
              />
            )}

            {ventana === "registro" && (
              <Registrarse
                onLoginSuccess={handleLoginSuccess}
                abrirIniciarSesion={() => setVentana("login")}
              />
            )}

            {ventana === "modalidades" && (
              <ModalidadRepartidor
                usuario={usuario}
                onClose={() => setVentana(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;