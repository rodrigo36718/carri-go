
import React, { useState } from "react";
import "../styles/components/pages/Delivery.css";

const Delivery = () => {
    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    const agregarAlCarrito = (nombre, precio) => {
        setCarrito((carritoActual) => [
            ...carritoActual,
            {
                nombre: nombre,
                precio: precio
            }
        ]);
    };

    const eliminarDelCarrito = (indice) => {
        setCarrito((carritoActual) =>
            carritoActual.filter((_, i) => i !== indice)
        );
    };

    const precioTotal = carrito.reduce(
        (total, producto) => total + producto.precio,
        0
    );

    const comprar = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        alert(
            `¡Pedido realizado correctamente!\n\nTotal: $${precioTotal.toLocaleString(
                "es-AR"
            )}`
        );

        setCarrito([]);
        setMostrarCarrito(false);
    };

    const restaurantes = [
        {
            nombre: "La Esquina Criolla",
            imagen: "/img/asado.jpg",
            descripcion: "Asado y comida criolla",
            precio: 8500
        },
        {
            nombre: "Sakura Roll",
            imagen: "/img/sushi.jpg",
            descripcion: "Sushi y comida japonesa",
            precio: 9200
        },
        {
            nombre: "Burger House",
            imagen: "/img/Hamburguesa2.jpg",
            descripcion: "Hamburguesas caseras",
            precio: 7500
        },
        {
            nombre: "Pollo Express",
            imagen: "/img/pollo.jpg",
            descripcion: "Pollo y comidas rápidas",
            precio: 6900
        },
        {
            nombre: "Wok del Barrio",
            imagen: "/img/Arroz_frito.jpg",
            descripcion: "Comida asiática",
            precio: 8200
        },
        {
            nombre: "Distrito Burger",
            imagen: "/img/Hamburguesa_especial.jpg",
            descripcion: "Hamburguesas especiales",
            precio: 8900
        },
        {
            nombre: "Milanesas Don Tito",
            imagen: "/img/milanesa.jpg",
            descripcion: "Milanesas caseras",
            precio: 7800
        },
        {
            nombre: "Nori Sushi",
            imagen: "/img/sushi.jpg",
            descripcion: "Sushi premium",
            precio: 10500
        },
        {
            nombre: "Fuego Norteño",
            imagen: "/img/asado.jpg",
            descripcion: "Parrilla y carnes",
            precio: 9500
        },
        {
            nombre: "Ruta Burger",
            imagen: "/img/Hamburguesa2.jpg",
            descripcion: "Hamburguesas y papas",
            precio: 7900
        },
        {
            nombre: "El Pollo Dorado",
            imagen: "/img/pollo.jpg",
            descripcion: "Pollo al horno y frituras",
            precio: 6500
        },
        {
            nombre: "Tokyo Box",
            imagen: "/img/Arroz_frito.jpg",
            descripcion: "Boxes de comida japonesa",
            precio: 11000
        }
    ];

    const restaurantesFiltrados = restaurantes.filter((restaurante) =>
        restaurante.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <main className="delivery-page">

            <section className="hero">
                <img
                    src="/img/fondo_delivery.jpg"
                    alt="Delivery"
                />

                <div className="hero-content">
                    <h1>
                        Pedí lo que quieras
                    </h1>
                    <h2>
                        llega a toda velocidad donde estes.
                    </h2>
                </div>
            </section>

            <section className="busqueda">

                <div className="busqueda-box">

                    <input
                        type="text"
                        placeholder="Buscar restaurante..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    {busqueda && (
                        <button
                            className="limpiar-busqueda"
                            onClick={() => setBusqueda("")}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    className="carrito"
                    onClick={() => setMostrarCarrito(!mostrarCarrito)}
                >
                    <span className="icono-carrito">
                        🛒
                    </span>

                    {carrito.length > 0 && (
                        <span className="carrito-numero">
                            {carrito.length}
                        </span>
                    )}
                </button>

            </section>

            {mostrarCarrito && (
                <section className="carrito-seccion">

                    <div className="carrito-contenido">

                        <div className="carrito-titulo">
                            <h2>Tu carrito</h2>

                            <span>
                                {carrito.length}{" "}
                                {carrito.length === 1
                                    ? "pedido"
                                    : "pedidos"}
                            </span>
                        </div>

                        {carrito.length === 0 ? (

                            <div className="carrito-vacio">
                                <span>🛒</span>

                                <p>
                                    Tu carrito está vacío
                                </p>

                                <small>
                                    Agregá un pedido para comenzar.
                                </small>
                            </div>

                        ) : (

                            <>
                                <div className="carrito-productos">

                                    {carrito.map((producto, indice) => (

                                        <div
                                            className="producto-carrito"
                                            key={indice}
                                        >

                                            <div>
                                                <h3>
                                                    {producto.nombre}
                                                </h3>

                                                <p>
                                                    Pedido de delivery
                                                </p>
                                            </div>

                                            <div className="producto-derecha">

                                                <strong>
                                                    $
                                                    {producto.precio.toLocaleString(
                                                        "es-AR"
                                                    )}
                                                </strong>

                                                <button
                                                    onClick={() =>
                                                        eliminarDelCarrito(
                                                            indice
                                                        )
                                                    }
                                                >
                                                    ELIMINAR
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                <div className="carrito-final">

                                    <div className="total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            $
                                            {precioTotal.toLocaleString(
                                                "es-AR"
                                            )}
                                        </strong>

                                    </div>

                                    <button
                                        className="comprar"
                                        onClick={comprar}
                                    >
                                        COMPRAR
                                    </button>

                                </div>
                            </>

                        )}

                    </div>

                </section>
            )}

            <section className="restaurantes">

                <div className="restaurantes-grid">

                    {restaurantesFiltrados.map(
                        (restaurante, indice) => (

                            <article
                                className="restaurante-card"
                                key={indice}
                            >

                                <div className="restaurante-imagen">

                                    <img
                                        src={restaurante.imagen}
                                        alt={restaurante.nombre}
                                    />

                                </div>

                                <div className="restaurante-info">

                                    <h2>
                                        {restaurante.nombre}
                                    </h2>

                                    <p>
                                        {restaurante.descripcion}
                                    </p>

                                    <div className="restaurante-detalles">

                                        <span>
                                            ★ 4.8
                                        </span>

                                        <span>
                                            25-35 min
                                        </span>

                                    </div>

                                    <div className="restaurante-abajo">

                                        <strong>
                                            $
                                            {restaurante.precio.toLocaleString(
                                                "es-AR"
                                            )}
                                        </strong>

                                        <button
                                            onClick={() =>
                                                agregarAlCarrito(
                                                    restaurante.nombre,
                                                    restaurante.precio
                                                )
                                            }
                                        >
                                            PEDIR YA
                                        </button>

                                    </div>

                                </div>

                            </article>

                        )
                    )}

                </div>

                {restaurantesFiltrados.length === 0 && (
                    <div className="sin-resultados">
                        <p>
                            No encontramos restaurantes con ese nombre.
                        </p>
                    </div>
                )}

            </section>

        </main>
    );
};

export default Delivery;

