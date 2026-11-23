BEGIN;

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
        CHECK (rol IN ('cliente', 'restaurante', 'repartidor', 'admin')),
    modalidad_delivery BOOLEAN DEFAULT false,
    modalidad_encargos BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- DIRECCIONES
-- =========================
CREATE TABLE IF NOT EXISTS direcciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    alias VARCHAR(50),
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20),
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    codigo_postal VARCHAR(20),
    referencia TEXT,
    latitud DECIMAL(10,7),
    longitud DECIMAL(10,7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- RESTAURANTES
-- =========================
CREATE TABLE IF NOT EXISTS restaurantes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    telefono VARCHAR(30),
    direccion TEXT,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORÍAS
-- =========================
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- =========================
-- PRODUCTOS (platos)
-- =========================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id),
    categoria_id INTEGER REFERENCES categorias(id),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
    imagen_url TEXT,
    disponible BOOLEAN DEFAULT TRUE,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PEDIDOS DELIVERY
-- =========================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES usuarios(id),
    restaurante_id INTEGER NOT NULL REFERENCES restaurantes(id),
    direccion_id INTEGER REFERENCES direcciones(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    costo_envio NUMERIC(12,2) NOT NULL DEFAULT 0,
    total NUMERIC(12,2) NOT NULL DEFAULT 0,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (subtotal >= 0 AND costo_envio >= 0 AND total >= 0)
);

-- =========================
-- DETALLES DE PEDIDOS
-- =========================
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    nombre_producto VARCHAR(150) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0)
);

-- =========================
-- ENCARGOS
-- =========================
CREATE TABLE IF NOT EXISTS encargos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES usuarios(id),
    direccion_id INTEGER REFERENCES direcciones(id),
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    direccion_compra TEXT,
    direccion_entrega TEXT,
    presupuesto NUMERIC(12,2) CHECK (presupuesto >= 0),
    costo_servicio NUMERIC(12,2) DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SERVICIOS DE REPARTIDOR
-- =========================
CREATE TABLE IF NOT EXISTS servicios_repartidor (
    id SERIAL PRIMARY KEY,
    repartidor_id INTEGER NOT NULL UNIQUE REFERENCES usuarios(id),
    vehiculo VARCHAR(50) NOT NULL,
    capacidad VARCHAR(100),
    zona VARCHAR(100),
    telefono VARCHAR(30),
    imagen_url TEXT,
    disponible BOOLEAN DEFAULT true,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ASIGNACIONES
-- =========================
CREATE TABLE IF NOT EXISTS asignaciones (
    id SERIAL PRIMARY KEY,
    repartidor_id INTEGER NOT NULL REFERENCES usuarios(id),
    pedido_id INTEGER UNIQUE REFERENCES pedidos(id),
    encargo_id INTEGER UNIQUE REFERENCES encargos(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'asignado',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (pedido_id IS NOT NULL AND encargo_id IS NULL)
        OR
        (pedido_id IS NULL AND encargo_id IS NOT NULL)
    )
);

-- =========================
-- PAGOS
-- =========================
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    encargo_id INTEGER REFERENCES encargos(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    importe NUMERIC(12,2) NOT NULL CHECK (importe >= 0),
    metodo VARCHAR(50),
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    referencia_externa VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (pedido_id IS NOT NULL AND encargo_id IS NULL)
        OR
        (pedido_id IS NULL AND encargo_id IS NOT NULL)
    )
);

-- =========================
-- CALIFICACIONES
-- =========================
CREATE TABLE IF NOT EXISTS calificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    repartidor_id INTEGER NOT NULL REFERENCES usuarios(id),
    pedido_id INTEGER REFERENCES pedidos(id),
    encargo_id INTEGER REFERENCES encargos(id),
    puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (pedido_id IS NOT NULL AND encargo_id IS NULL)
        OR
        (pedido_id IS NULL AND encargo_id IS NOT NULL)
    )
);

-- =========================
-- NOTIFICACIONES
-- =========================
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- HISTORIAL DE ESTADOS
-- =========================
CREATE TABLE IF NOT EXISTS historial_estados (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    encargo_id INTEGER REFERENCES encargos(id),
    estado VARCHAR(30) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (pedido_id IS NOT NULL AND encargo_id IS NULL)
        OR
        (pedido_id IS NULL AND encargo_id IS NOT NULL)
    )
);

-- =========================
-- ÍNDICES
-- =========================
CREATE INDEX IF NOT EXISTS idx_direcciones_usuario ON direcciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_productos_restaurante ON productos(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_encargos_cliente ON encargos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_encargos_estado ON encargos(estado);
CREATE INDEX IF NOT EXISTS idx_servicios_repartidor ON servicios_repartidor(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_servicios_estado ON servicios_repartidor(estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_repartidor ON asignaciones(repartidor_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);

COMMIT;