import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/components/layout/Nav.css";

const Nav = () => {
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

            </ul>

        </nav>
    );
};

export default Nav;