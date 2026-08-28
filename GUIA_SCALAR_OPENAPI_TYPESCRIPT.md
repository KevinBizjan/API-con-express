# 📘 Guía: Cómo agregar Scalar y OpenAPI a un proyecto de Node.js con TypeScript

Esta guía paso a paso explica cómo integrar la documentación interactiva moderna de **[Scalar](https://github.com/scalar/scalar)** y la especificación **OpenAPI (Swagger)** en un proyecto de **Node.js con TypeScript y Express**.

---

## 📋 Prerequisitos e Instalación

### 1. Instalar dependencias del proyecto

En la terminal de tu proyecto, instala Express, Scalar y las definiciones de tipos para TypeScript:

```bash
# Dependencias de producción
npm install express @scalar/express-api-reference dotenv

# Dependencias de desarrollo (TypeScript)
npm install -D typescript @types/node @types/express tsx
```

> **Nota:** `tsx` es un ejecutor rápido para archivos `.ts` en modo desarrollo (alternativa moderna a `ts-node`).

---

## ⚙️ Configuración de TypeScript (`tsconfig.json`)

Asegúrate de tener un archivo `tsconfig.json` configurado correctamente. En especial habilita `resolveJsonModule` y `esModuleInterop`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

---

## 📝 Definir la especificación OpenAPI (`openapi.json` / `openapi.yaml`)

Crea un archivo llamado `openapi.json` en la raíz o en `src/openapi.json`:

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Mi API con TypeScript y Scalar",
    "description": "Documentación interactiva generada con Scalar API Reference",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Servidor Local de Desarrollo"
    }
  ],
  "paths": {
    "/api/v1/health": {
      "get": {
        "summary": "Verificar estado de salud",
        "responses": {
          "200": {
            "description": "Servidor operando correctamente"
          }
        }
      }
    }
  }
}
```

---

## 🚀 Integración en Express con TypeScript (`src/app.ts`)

Crea o modifica tu archivo de aplicación Express (`src/app.ts`):

```typescript
import express, { Request, Response, Application } from 'express';
import path from 'path';
import { apiReference } from '@scalar/express-api-reference';

const app: Application = express();

app.use(express.json());

// 1. Servir el archivo OpenAPI JSON
app.get('/openapi.json', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'openapi.json'));
});

// 2. Montar el middleware de Scalar en la ruta /docs
app.use(
  '/docs',
  apiReference({
    theme: 'purple', // Opciones de tema: 'purple', 'moon', 'saturn', 'solarized', etc.
    spec: {
      url: '/openapi.json', // Apunta a la ruta expuesta del OpenAPI
    },
  })
);

// 3. Endpoint de prueba
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default app;
```

---

## 🏁 Punto de Entrada y Scripts (`src/index.ts` y `package.json`)

### Archivo `src/index.ts`:

```typescript
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript corriendo en http://localhost:${PORT}`);
  console.log(`📖 Documentación Scalar activa en http://localhost:${PORT}/docs`);
});
```

### Agregar scripts en `package.json`:

```json
{
  "name": "node-typescript-scalar-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 🧪 Verificación y Prueba

1. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

2. Abre en tu navegador:
   👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

Verás la interfaz visual de **Scalar**, donde podrás:
- Probar llamadas de API en tiempo real (*Try it out*).
- Generar fragmentos de código en JavaScript, Python, cURL, Go, PHP, etc.
- Navegar la especificación OpenAPI de manera fluida.
