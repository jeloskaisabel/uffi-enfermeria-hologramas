# Babylon Frontend

Aplicación web interactiva para visualización de modelos 3D anatómicos usando Babylon.js, diseñada para estudio de modelos anatómicos.

## Funcionalidades
- Visualizador 3D interactivo de modelos anatómicos
- Navegación por categorías de modelos
- Lista dinámica de modelos por categoría
- Interfaz responsive con Tailwind CSS
- Integración con API backend para datos de modelos

## Tecnologías
- Vue.js 3 (Composition API)
- Babylon.js 8.26.1 (motor 3D)
- Vite 7.0.6 (build tool)
- Tailwind CSS 4.1.12 (estilos)
- Vue Router 4.5.1 (navegación)

## Componentes Principales
- `VisualizerComponent.vue` - Vista principal del visualizador
- `DisplayBabylon.vue` - Renderizado 3D con Babylon.js
- `ListModels.vue` - Lista de modelos disponibles
- `HomeComponent.vue` - Página de inicio

## Instalación
```bash
npm install
```

## Uso
```bash
# Desarrollo
npm run dev

# Construcción para produccion
npm run build

# Vista previa de build
npm run preview

# Linting y formato
npm run lint
npm run format
```

## Estructura
- `src/App.vue` - Layout principal con navegación
- `src/components/` - Componentes Vue reutilizables
- `src/router/` - Configuración de rutas
- `src/assets/` - Imágenes y recursos estáticos
- `public/images/` - Logo y assets públicos