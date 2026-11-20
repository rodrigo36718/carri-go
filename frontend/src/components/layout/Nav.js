import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/layout/Nav.css";

const Nav = ({ usuario }) => {
  return (
    <nav className="nav">
      <ul className="nav-lista">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link activo" : "nav-link"
            }
          >
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Delivery"
            className={({ isActive }) =>
              isActive ? "nav-link activo" : "nav-link"
            }
          >
            Delivery
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Encargos"
            className={({ isActive }) =>
              isActive ? "nav-link activo" : "nav-link"
            }
          >
            Encargos
          </NavLink>
        </li>

        {/* Solo RESTAURANTE */}
        {usuario?.rol === "restaurante" && (
          <li>
            <NavLink
              to="/MisProductos"
              className={({ isActive }) =>
                isActive ? "nav-link activo" : "nav-link"
              }
            >
              Mis Platos
            </NavLink>
          </li>
        )}

        {/* Solo REPARTIDOR */}
        {usuario?.rol === "repartidor" && (
          <li>
            <NavLink
              to="/MiServicio"
              className={({ isActive }) =>
                isActive ? "nav-link activo" : "nav-link"
              }
            >
              Mi Servicio
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;