import React, { useState, useEffect } from "react";
import "../styles/components/pages/Delivery.css";

const Delivery = () => {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProductos(data.productos || []);
        }
      })
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, []);

  const agregarAlCarrito = (nombre, precio) => {
    setCarrito((carritoActual) => [
      ...carritoActual,
      { nombre, precio: Number(precio) },
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

  const productosFiltrados = productos.filter((p) => {
    const texto = `${p.nombre} ${p.descripcion || ""} ${
      p.restaurante_nombre || ""
    }`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <main className="delivery-page">
      <section className="hero">
        <img src="/img/fondo_delivery.jpg" alt="Delivery" />
        <div className="hero-content">
          <h1>Pedí lo que quieras</h1>
          <h2>llega a toda velocidad donde estes.</h2>
        </div>
      </section>

      <section className="busqueda">
        <div className="busqueda-box">
          <input
            type="text"
            placeholder="Buscar plato o restaurante..."
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
          <span className="icono-carrito">🛒</span>
          {carrito.length > 0 && (
            <span className="carrito-numero">{carrito.length}</span>
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
                {carrito.length === 1 ? "pedido" : "pedidos"}
              </span>
            </div>

            {carrito.length === 0 ? (
              <div className="carrito-vacio">
                <span>🛒</span>
                <p>Tu carrito está vacío</p>
                <small>Agregá un pedido para comenzar.</small>
              </div>
            ) : (
              <>
                <div className="carrito-productos">
                  {carrito.map((producto, indice) => (
                    <div className="producto-carrito" key={indice}>
                      <div>
                        <h3>{producto.nombre}</h3>
                        <p>Pedido de delivery</p>
                      </div>
                      <div className="producto-derecha">
                        <strong>
                          ${producto.precio.toLocaleString("es-AR")}
                        </strong>
                        <button onClick={() => eliminarDelCarrito(indice)}>
                          ELIMINAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="carrito-final">
                  <div className="total">
                    <span>Total</span>
                    <strong>
                      ${precioTotal.toLocaleString("es-AR")}
                    </strong>
                  </div>
                  <button className="comprar" onClick={comprar}>
                    COMPRAR
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="restaurantes">
        {cargando ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            Cargando platos...
          </p>
        ) : (
          <div className="restaurantes-grid">
            {productosFiltrados.map((producto) => (
              <article className="restaurante-card" key={producto.id}>
                <div className="restaurante-imagen">
                  <img
                    src={
                      producto.imagen_url ||
                      "/img/Hamburguesa2.jpg"
                    }
                    alt={producto.nombre}
                  />
                </div>

                <div className="restaurante-info">
                  <h2>{producto.nombre}</h2>
                  <p>
                    {producto.descripcion ||
                      producto.restaurante_nombre ||
                      "Sin descripción"}
                  </p>

                  <div className="restaurante-detalles">
                    <span>
                      {producto.restaurante_nombre || "Restaurante"}
                    </span>
                    <span>★ 4.8</span>
                  </div>

                  <div className="restaurante-abajo">
                    <strong>
                      $
                      {Number(producto.precio).toLocaleString("es-AR")}
                    </strong>
                    <button
                      onClick={() =>
                        agregarAlCarrito(
                          producto.nombre,
                          producto.precio
                        )
                      }
                    >
                      PEDIR YA
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <div className="sin-resultados">
            <p>
              {productos.length === 0
                ? "Todavía no hay platos publicados. ¡Los restaurantes pueden publicar desde Mis Platos!"
                : "No encontramos platos con esa búsqueda."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Delivery;