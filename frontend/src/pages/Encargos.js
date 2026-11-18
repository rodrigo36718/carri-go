import React from "react";
import "../styles/components/pages/Encargos.css";

const Encargos = (props) => {
    return (
        <main className="encargos-page">
            <section className="encargos-hero">
                <img
                    src="/img/fondodeencargo.jpg"
                    alt="Servicio de encargos"
                />

                <div className="encargos-hero-overlay"></div>

                <div className="encargos-hero-content">
                    <h1>
                        ¿Necesitás que alguien<br />
                        vaya a buscar algo?
                    </h1>

                    <p>
                        Contratá un repartidor para realizar tu encargo
                        de forma rápida y sencilla.
                    </p>
                </div>
            </section>
            <section className="busqueda-encargos">
                <div className="busqueda-encargos-box">

                    <input
                        type="text"
                        placeholder="¿Qué necesitás que busquen?"
                    />
                </div>
            </section>
            <section className="repartidores">
                <div className="repartidores-grid">
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor1.jpg"
                                alt="Juan Pérez"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>JUAN PÉREZ</h3>

                            <p>📍 Centro</p>
                            <p>🏍️ Moto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>15 min</span>
                            </div>

                            <button className="btn-elegir">
                                Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor2.jpg"
                                alt="Sofía Gómez"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>SOFÍA GÓMEZ</h3>

                            <p>📍 Palermo</p>
                            <p>🚗 Auto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>20 min</span>
                            </div>

                            <button className="btn-elegir">
                               Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor3.jpg"
                                alt="Martín Silva"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>MARTÍN SILVA</h3>

                            <p>📍 Belgrano</p>
                            <p>🏍️ Moto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★☆
                                </span>

                                <span>18 min</span>
                            </div>

                            <button className="btn-elegir">
                               Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor4.jpg"
                                alt="Camila Ruiz"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>CAMILA RUIZ</h3>

                            <p>📍 Caballito</p>
                            <p>🚲 Bicicleta</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>12 min</span>
                            </div>

                            <button className="btn-elegir">
                                Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor5.jpg"
                                alt="Diego Martínez"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>DIEGO MARTÍNEZ</h3>

                            <p>📍 Flores</p>
                            <p>🏍️ Moto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>16 min</span>
                            </div>

                            <button className="btn-elegir">
                               Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor6.jpg"
                                alt="Valentina López"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>VALENTINA LÓPEZ</h3>

                            <p>📍 Almagro</p>
                            <p>🚗 Auto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★☆
                                </span>

                                <span>22 min</span>
                            </div>

                            <button className="btn-elegir">
                                Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor7.jpg"
                                alt="Lucas Fernández"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>LUCAS FERNÁNDEZ</h3>

                            <p>📍 Villa Crespo</p>
                            <p>🏍️ Moto</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>14 min</span>
                            </div>

                            <button className="btn-elegir">
                                Pedir encargo
                            </button>
                        </div>

                    </article>
                    <article className="repartidor">

                        <div className="repartidor-foto">
                            <img
                                src="/img/repartidor8.jpg"
                                alt="Martina Díaz"
                            />
                        </div>

                        <div className="repartidor-info">
                            <h3>MARTINA DÍAZ</h3>

                            <p>📍 Núñez</p>
                            <p>🚲 Bicicleta</p>

                            <div className="repartidor-bottom">
                                <span className="estrellas">
                                    ★★★★★
                                </span>

                                <span>10 min</span>
                            </div>

                            <button className="btn-elegir">
                               Pedir encargo
                            </button>
                        </div>

                    </article>

                </div>

            </section>

        </main>
    );
};

export default Encargos;