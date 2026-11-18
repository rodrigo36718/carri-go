
import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/pages/Inicio.css";

const Inicio = () => {
    return (
        <main className="inicio">

            {/* PORTADA PRINCIPAL */}
            <section
                className="inicio-hero"
                style={{
                    backgroundImage: "url('/img/fondo_holder.png')"
                }}
            >
                <div className="inicio-hero-overlay"></div>

                <div className="inicio-hero-contenido">

                    <span className="inicio-etiqueta">
                        DELIVERY RÁPIDO Y SEGURO
                    </span>

                    <h2>
                        Llevá lo que necesitás,
                        <br />
                        <span>cuando quieras.</span>
                    </h2>

                    <p>
                        Encontrá un repartidor cerca tuyo y enviá lo que
                        necesites de forma rápida, sencilla y segura.
                        Comida, compras y encargos en un solo lugar.
                    </p>

                    {/* BUSCADOR */}
                    <div className="inicio-buscador">

                        <img
                            src="/img/ubicacion_buscador.jpg"
                            alt=""
                            className="inicio-icono"
                        />

                        <input
                            type="text"
                            placeholder="¿Qué necesitás llevar?"
                            aria-label="¿Qué necesitás llevar?"
                        />

                        <button
                            type="button"
                            className="inicio-boton-buscar"
                        >
                            <span
                                className="inicio-lupa"
                                aria-hidden="true"
                            ></span>
                            Buscar
                        </button>

                    </div>

                    {/* BENEFICIOS */}
                    <div className="inicio-beneficios">

                        <div className="beneficio">

                            <div className="beneficio-icono">
                                <img
                                    src="/img/proteccion.jpg"
                                    alt=""
                                />
                            </div>

                            <div>
                                <strong>Pagos seguros</strong>
                                <span>Todo desde la plataforma</span>
                            </div>

                        </div>

                        <div className="beneficio">

                            <div className="beneficio-icono">
                                <img
                                    src="/img/imagenrayo.jpg"
                                    alt=""
                                />
                            </div>

                            <div>
                                <strong>Entrega rápida</strong>
                                <span>En el menor tiempo posible</span>
                            </div>

                        </div>

                        <div className="beneficio">

                            <div className="beneficio-icono">
                                <img
                                    src="/img/repartidores-icono.jpg"
                                    alt=""
                                />
                            </div>

                            <div>
                                <strong>Repartidores confiables</strong>
                                <span>Conocé cada perfil</span>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* SERVICIOS */}
            <section className="inicio-servicios">

                <div className="servicios-titulo">

                    <h2>Nuestros servicios</h2>

                    <p>
                        En Carri-GO encontrás diferentes soluciones
                        para tus entregas. Elegí el servicio que
                        necesitás y resolvé tus pedidos de forma
                        práctica y sencilla.
                    </p>

                </div>

                <div className="servicios-grid">

                    {/* DELIVERY */}
                    <article className="servicio-card">

                        <div
                            className="servicio-imagen"
                            style={{
                                backgroundImage:
                                    "url('/img/Hamburguesa2.jpg')"
                            }}
                        ></div>

                        <div className="servicio-contenido">

                            <div className="servicio-icono">
                                <img
                                    src="/img/logomoto.jpg"
                                    alt=""
                                />
                            </div>

                            <h3>Delivery</h3>

                            <p>
                                Disfrutá de tus comidas favoritas
                                sin salir de casa. Explorá las
                                opciones disponibles, elegí lo que
                                querés y recibí tu pedido en la
                                dirección indicada.
                            </p>

                            <ul className="servicio-detalles">
                                <li>Explorá las opciones de comida.</li>
                                <li>Realizá tus pedidos fácilmente.</li>
                                <li>Recibí tus compras en tu domicilio.</li>
                            </ul>

                            <Link
                                to="/Delivery"
                                className="servicio-link"
                            >
                                Explorar delivery →
                            </Link>

                        </div>
                    </article>

                    {/* ENCARGOS */}
                    <article className="servicio-card">

                        <div
                            className="servicio-imagen"
                            style={{
                                backgroundImage:
                                    "url('/img/fondodeencargo.jpg')"
                            }}
                        ></div>

                        <div className="servicio-contenido">

                            <div className="servicio-icono">
                                <img
                                    src="/img/logopaquete.jpg"
                                    alt=""
                                />
                            </div>

                            <h3>Encargos</h3>

                            <p>
                                ¿Necesitás algo y no podés ir a
                                buscarlo? Solicitá un repartidor
                                para realizar una compra, retirar
                                un paquete o trasladar un producto
                                hasta donde lo necesitás.
                            </p>

                            <ul className="servicio-detalles">
                                <li>Solicitá compras y retiros.</li>
                                <li>Indicá dónde retirar y entregar.</li>
                                <li>Organizá el traslado que necesitás.</li>
                            </ul>

                            <Link
                                to="/Encargos"
                                className="servicio-link"
                            >
                                Solicitar un encargo →
                            </Link>

                        </div>
                    </article>

                    {/* REPARTIDORES */}
                    <article className="servicio-card">

                        <div
                            className="servicio-imagen"
                            style={{
                                backgroundImage:
                                    "url('/img/fondo_delivery.jpg')"
                            }}
                        ></div>

                        <div className="servicio-contenido">

                            <div className="servicio-icono">
                                <img
                                    src="/img/logorepartidores.jpg"
                                    alt=""
                                />
                            </div>

                            <h3>Repartidores</h3>

                            <p>
                                Convertite en repartidor independiente
                                y ofrecé tus servicios. Indicá tu
                                medio de transporte, establecé tus
                                condiciones y elegí los pedidos
                                que quieras realizar.
                            </p>

                            <ul className="servicio-detalles">
                                <li>Ofrecé tus servicios de reparto.</li>
                                <li>Indicá tu medio de transporte.</li>
                                <li>Elegí los pedidos que te interesen.</li>
                            </ul>

                            <Link
                                to="/Repartidores"
                                className="servicio-link"
                            >
                                Quiero ser repartidor →
                            </Link>

                        </div>
                    </article>

                </div>
            </section>

        </main>
    );
};

export default Inicio;
