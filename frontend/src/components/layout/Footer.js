import React from "react";
import "../../styles/components/layout/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-contenido">

                <div className="footer-marca">

                    <img
                        src="/img/logo.png"
                        alt="Carri-GO"
                    />

                    <span>Carri-GO</span>

                </div>

                <div className="footer-separador"></div>

                <p>
                    Más cerca, más rápido.
                </p>

            </div>

        </footer>
    );
};

export default Footer;
