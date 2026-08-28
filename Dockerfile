# 1. Imagen base ligera de Node.js Alpine
FROM node:22-alpine

# 2. Configurar directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar manifestos de dependencias
COPY package*.json ./

# 4. Instalar solo dependencias de producción para optimizar el tamaño de la imagen
RUN npm ci --only=production

# 5. Copiar el código fuente del proyecto
COPY . .

# 6. Exponer el puerto de la aplicación (3000 por defecto)
EXPOSE 3000

# 7. Configurar variable de ambiente por defecto
ENV NODE_ENV=production
ENV PORT=3000

# 8. Healthcheck nativo de Docker para monitorear el contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# 9. Comando para ejecutar la aplicación
CMD ["node", "src/index.js"]
