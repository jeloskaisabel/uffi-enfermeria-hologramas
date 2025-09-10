# Babylon Backend

API REST para el sistema de visualización de modelos 3D de anatomía humana.

## Funcionalidades
- Servir modelos 3D estáticos desde `/models`
- API para categorías de modelos anatómicos
- Endpoints para obtener jerarquía de modelos por categoría
- Servir aplicación frontend desde `/dist`

## Tecnologías
- Node.js (ES Modules)
- Express.js 5.1.0
- CORS para cross-origin requests
- dotenv para variables de entorno

## Endpoints API
- `GET /api/categories` - Obtiene categorías principales
- `GET /api/models/:type` - Obtiene modelos de una categoría específica

## Instalación
```bash
npm install
```

## Uso
```bash
# Desarrollo (con watch mode)
npm run dev

# Produccion
npm start

# Despliegue local
npm run deploy:local
```

## Estructura
- `src/app.js` - Configuración Express y middleware
- `src/controllers/models.js` - Lógica de negocio para modelos
- `src/routes/api.js` - Definición de rutas API
- `src/middleware/` - CORS y manejo de errores
- `src/service/` - Servicios de datos