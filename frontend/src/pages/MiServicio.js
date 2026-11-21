import React, { useState, useEffect, useRef } from "react";
import "../styles/components/pages/MiServicio.css";

const API = "http://localhost:3001";

const MiServicio = () => {
  const [vehiculo, setVehiculo] = useState("moto");
  const [capacidad, setCapacidad] = useState("");
  const [zona, setZona] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [servicioActual, setServicioActual] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    if (!usuario || usuario.rol !== "repartidor") return;

    fetch(`${API}/api/servicios`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && Array.isArray(data.servicios)) {
          const mio = data.servicios.find(
            (s) => Number(s.repartidor_id) === Number(usuario.id)
          );
          if (mio) {
            setServicioActual(mio);
            setVehiculo(mio.vehiculo || "moto");
            setCapacidad(mio.capacidad || "");
            setZona(mio.zona || "");
            setTelefono(mio.telefono || usuario.telefono || "");
            if (mio.imagen_url) setPreview(mio.imagen_url);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(true);
      setMensaje("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(true);
      setMensaje("La imagen no puede superar los 5MB");
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setError(false);
    setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    if (!capacidad.trim() || !zona.trim() || !telefono.trim()) {
      setError(true);
      setMensaje("Completá todos los campos");
      return;
    }

    if (!servicioActual && !imagen) {
      setError(true);
      setMensaje("La foto es obligatoria");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("vehiculo", vehiculo);
      formData.append("capacidad", capacidad);
      formData.append("zona", zona);
      formData.append("telefono", telefono);
      if (imagen) formData.append("imagen", imagen);

      const res = await fetch(`${API}/api/servicios`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(true);
        setMensaje(data.message || "No se pudo guardar");
      } else {
        setError(false);
        setMensaje(
          servicioActual
            ? "Servicio actualizado. Ya se ve en Encargos."
            : "Servicio publicado. Ya se ve en Encargos."
        );
        setServicioActual(data.servicio);
        if (data.servicio?.imagen_url) setPreview(data.servicio.imagen_url);
        setImagen(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario || usuario.rol !== "repartidor") {
    return (
      <main className="mi-servicio-page">
        <div className="acceso-restringido">
          <h2>Acceso restringido</h2>
          <p>Solo los repartidores pueden acceder a esta sección.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mi-servicio-page">
      <section className="mi-servicio-hero">
        <h1>Mi Servicio</h1>
        <p>
          {usuario.nombre} {usuario.apellido} — publicá tus datos para Encargos
        </p>
      </section>

      <section className="mi-servicio-contenido">
        <div className="form-servicio">
          <h2>
            {servicioActual ? "Modificar mi servicio" : "Publicar mi servicio"}
          </h2>

          <div className="datos-repartidor">
            <p>
              <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label>Vehículo *</label>
              <select
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
                required
              >
                <option value="moto">Moto</option>
                <option value="auto">Auto</option>
                <option value="bicicleta">Bicicleta</option>
                <option value="a pie">A pie</option>
              </select>
            </div>

            <div className="campo">
              <label>Capacidad *</label>
              <input
                type="text"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                placeholder="Ej: hasta 15 kg"
                required
              />
            </div>

            <div className="campo">
              <label>Zona donde trabajás *</label>
              <input
                type="text"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Centro, Palermo, etc."
                required
              />
            </div>

            <div className="campo">
              <label>Teléfono de contacto *</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="1122334455"
                required
              />
            </div>

            <div className="campo">
              <label>
                Foto {servicioActual ? "(opcional al modificar)" : "*"}
              </label>
              <div className="input-archivo">
                <button
                  type="button"
                  className="btn-archivo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar archivo
                </button>
                <span className="nombre-archivo">
                  {imagen
                    ? imagen.name
                    : preview
                    ? "Imagen cargada"
                    : "Sin archivos seleccionados"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  style={{ display: "none" }}
                />
              </div>
              {preview && (
                <div className="preview-imagen">
                  <img src={preview} alt="Vista previa" />
                </div>
              )}
            </div>

            {mensaje && (
              <p className={error ? "mensaje-error" : "mensaje-ok"}>
                {mensaje}
              </p>
            )}

            <button type="submit" className="btn-publicar" disabled={cargando}>
              {cargando
                ? "Guardando..."
                : servicioActual
                ? "Guardar cambios"
                : "Publicar servicio"}
            </button>
          </form>
        </div>

        {servicioActual && (
          <div className="servicio-actual">
            <h2>Publicado en Encargos</h2>
            <div className="servicio-card">
              {preview && (
                <div className="servicio-foto">
                  <img
                    src={preview}
                    alt={`${usuario.nombre} ${usuario.apellido}`}
                  />
                </div>
              )}
              <p>
                <strong>Repartidor:</strong> {usuario.nombre} {usuario.apellido}
              </p>
              <p>
                <strong>Vehículo:</strong> {servicioActual.vehiculo}
              </p>
              <p>
                <strong>Capacidad:</strong> {servicioActual.capacidad}
              </p>
              <p>
                <strong>Zona:</strong> {servicioActual.zona}
              </p>
              <p>
                <strong>Teléfono:</strong> {servicioActual.telefono}
              </p>
              <span className="badge-disponible">Visible para clientes</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default MiServicio;