# 🚀 Express Practice REST API (`/health` & `/info`)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/e9a67c53a01f44d39ec92116ea92a132)](https://app.codacy.com/gh/KevinBizjan/API-con-express/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)


Proyecto de práctica de **API REST** construida con **Node.js** y **Express** (sintaxis ES Modules). Incluye endpoints de monitoreo de salud (`/health`), información (`/info`), registro de solicitudes (logging), manejo estructurado de errores y un **Dashboard Web Interactivo** para probar las llamadas en tiempo real desde el navegador.

---

## 🛠️ Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior

---

## 🚀 Cómo Iniciar el Proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor en modo desarrollo**:
   ```bash
   npm run dev
   # o bien: npm start
   ```

3. **Acceder al Dashboard Interactivo**:
   Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## 📡 Endpoints de la API

### 1. Estado de Salud (`/api/v1/health` o `/health`)
- **Método**: `GET`
- **Descripción**: Retorna métricas en tiempo real del servidor (uptime, uso de memoria RAM, CPU, especificaciones del sistema operativo y timestamp).
- **Ejemplo cURL**:
  ```bash
  curl -i http://localhost:3000/api/v1/health
  ```

### 2. Información de la API (`/api/v1/info` o `/info`)
- **Método**: `GET`
- **Descripción**: Retorna la versión del servicio, el ambiente de ejecución, el catálogo de rutas disponibles y datos de contacto/mantenimiento.
- **Ejemplo cURL**:
  ```bash
  curl -i http://localhost:3000/api/v1/info
  ```

### 3. Verification Ping (`/api/v1/ping` o `/ping`)
- **Método**: `GET`
- **Descripción**: Comprobación ultraligera de disponibilidad (`"pong"`).
- **Ejemplo cURL**:
  ```bash
  curl -i http://localhost:3000/api/v1/ping
  ```

---

## 📂 Estructura del Proyecto

```
.
├── package.json              # Configuración y dependencias del proyecto
├── .env                      # Variables de entorno
├── README.md                 # Documentación del proyecto
├── src/
│   ├── index.js              # Punto de entrada y arranque del servidor HTTP
│   ├── app.js                # Configuración de Express, middlewares y rutas
│   ├── controllers/
│   │   ├── health.controller.js  # Lógica del healthcheck y ping
│   │   └── info.controller.js    # Lógica de la información del sistema
│   ├── routes/
│   │   ├── health.routes.js # Mapeo de rutas para health/ping
│   │   └── info.routes.js   # Mapeo de rutas para info
│   └── middleware/
│       ├── logger.js        # Middleware para registrar HTTP requests en consola
│       └── errorHandler.js  # Manejo centralizado de 404 Not Found y errores 500
└── public/
    └── index.html           # Interfaz UI web de prueba interactiva
```

---

## 💡 Ejercicios Sugeridos para Practicar

1. **Añadir un nuevo endpoint**: Crea `/api/v1/users` o `/api/v1/metrics` creando su correspondiente controller y archivo de rutas.
2. **Añadir validación**: Agrega un middleware para validar headers (ej. `x-api-key`).
3. **Persistencia de datos**: Conecta la API a una base de datos como SQLite, PostgreSQL o MongoDB.

