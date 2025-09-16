# Unreal Configurator Panel

Panel web (React + TypeScript + Vite) que actúa como interfaz de configuración remota para una experiencia de Unreal Engine transmitida mediante Pixel Streaming (Arcware). Permite:

- Navegar diferentes colecciones y variaciones de materiales
- Enviar cambios de material al runtime (material-change)
- Cambiar vistas de cámara (view)
- Ajustar tinte RGB y enviar dicho valor (tint-change)
- Generar un PDF (captura estática del panel) con el estado visible
- Tomar capturas (screenshot) / render desde el stream

---
## 1. Tecnologías principales
| Área | Tecnología |
|------|------------|
| Frontend | React 19 + TypeScript |
| Bundler | Vite |
| Routing | react-router-dom |
| Pixel Streaming | @arcware-cloud/pixelstreaming-websdk |
| UI Helpers | react-color-palette, react-icons |
| PDF | react-to-pdf |
| Lint | ESLint (typescript-eslint, react-hooks, react-refresh) |

---
## 2. Estructura básica
```
/ (root)
  package.json
  vite.config.ts
  eslint.config.js
  src/
    main.tsx            # Punto de montaje
    router.tsx          # Definición de rutas
    App.tsx             # Pantalla landing
    components/
      arcware/
        ArcwarePlayer.tsx   # Contiene el video + Sidepanel
        ps-functions.ts     # Helpers para comunicar con Unreal
      panel/
        Sidepanel.tsx       # UI principal de configuración
        Sidepanel.css        
        collections.json    # Datos de ejemplo (colecciones/variaciones)
      view-rotator/
        view-rotator.tsx    # Cambios de cámara/vista + screenshot
      colorTint/
        colorTint.tsx       # Selector de color (tinte)
      pdfConfigurator/
        pdfGenerator.tsx    # Utilidad para generar PDF
```

---
## 3. Scripts (npm)
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run preview` | Sirve la build para verificación |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

---
## 4. Inicio rápido
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev
# Abrir en el navegador: http://localhost:5173 (puerto por defecto Vite)
```

Ruta principal (landing): `/`
Ruta de aplicación: `/mayerfabrics`

---
## 5. Flujo general de la app
1. El usuario entra a `/` y ve un landing minimal.
2. Al hacer clic en START APP navega a `/mayerfabrics`.
3. `ArcwarePlayer` inicializa el SDK de Pixel Streaming y embebe el video (stream).
4. El `Sidepanel` queda abierto (o se puede cerrar/abrir) y permite:
   - Seleccionar colecciones / subcolecciones / variaciones.
   - Enviar eventos de cambio de material a UE.
   - Ajustar tinte (slider color). Envía un float RGB normalizado en 0..1.
   - Cambiar vistas con `ViewRotator` (<, > y botón de captura).
   - Exportar un PDF del panel.

---
## 6. Comunicación con Unreal (eventos emitidos)
El puente es `window.emitUIInteraction` (inyectado por el SDK). El helper `sendUE` / `sendToUE` envía objetos o strings.

Eventos clave:
| Evento | Forma | Ejemplo Payload |
|--------|-------|-----------------|
| Material change | `{ "material-change": "MI_COLLECTION_SUB_VARIATION" }` | `{ "material-change": "MI_FABRICS_BASIC_BLUE-STRIPES" }` |
| View change | `{ view: "0" }` (o índice formateado) | `{ view: "2" }` |
| Tint change | `{ "tint-change": "0.1234,0.5678,0.9012" }` | Cadena con floats 0..1 separados por coma |
| Screenshot | `{ screenshot: "res-01" }` | Resolución simbólica |

### Construcción de nombres de material
`Sidepanel.tsx` genera un nombre tipo `MI_{COLLECTION}_{SUBCOL}_{VARIATION}` aplicando:
- Normalización (quita acentos)
- Uppercase
- Sustitución de espacios por guiones

---
## 7. Datos de colecciones
El archivo `collections.json` (ejemplo) se normaliza con una función que soporta varias formas de declarar:
- `collection-name` / `name`
- `subcollections` / `subcollection`
- `variations` / `variation`
- Variaciones como string simple o como objeto con:
  - `variation-name`
  - `variation-pattern`
  - `variation-image` / `variation-image-thumbnail`

La normalización produce:
```ts
interface NormalizedCollection { name: string; subcollections: NormalizedSubcollection[] }
interface NormalizedSubcollection { name: string; description?: string; image?: string; variations: NormalizedVariation[] }
interface NormalizedVariation { label: string; imageThumbnail?: string; imageLarge?: string; color?: string; pattern?: string; name?: string }
```

---
## 8. Componentes principales
| Componente | Rol |
|------------|-----|
| `ArcwarePlayer` | Inicializa streaming, contiene video y aside con panel |
| `Sidepanel` | UI general: tint, export, selector de materiales |
| `ConfiguratorPanel` (interno) | Normaliza y muestra colecciones/variaciones |
| `ViewRotator` | Cambia índice de vista + botón screenshot |
| `ColorTint` | ColorPicker que emite RGB entero y se normaliza a floats |
| `pdfGenerator` | Utilidad que encapsula `react-to-pdf` |

---
## 9. Accesibilidad básica
- Botones usan `aria-label` cuando solo hay icono (`ViewRotator` screenshot).
- Cambios dinámicos (selección, descripciones) usan `aria-live="polite"`.
- Select de colecciones con etiqueta `label + select`.

---
## 10. Exportación a PDF
`generateConfiguratorPDF(targetId)` usa `react-to-pdf` contra el elemento `#sp-body`.
El botón se deshabilita y muestra estado: “Creating pdf…”.
Fallback: `window.print()` si falla.

---
## 11. Estilos
- Un solo stylesheet principal: `Sidepanel.css`.
- Variables CSS (`:root`) para spacing, colores y tamaños adaptativos.
- Layout responsive del panel (grid `aw-shell`).

---
## 12. Despliegue
Incluye `vercel.json` (no mostrado aquí) -> preparado para deploy rápido en Vercel. Build estándar:
```bash
npm run build
npm run preview
```
Sube la carpeta generada por Vite a tu hosting estático (si no usas Vercel).

---
## 13. Personalización rápida
| Necesidad | Dónde tocar |
|-----------|-------------|
| Cambiar vistas | `view-rotator.tsx` (prop `views`) |
| Ajustar payload screenshot | Botón en `view-rotator.tsx` |
| Cambiar naming materiales | Función `buildMaterialInstanceName` en `Sidepanel.tsx` |
| Añadir metadatos variaciones | Extender normalización en `Sidepanel.tsx` |
| Cambiar formato PDF | Opciones en `pdfGenerator.tsx` |

---
## 14. Próximas ideas (sugerencias)
- Estado visual de screenshot (loading / success toast)
- Cache / memo de imágenes grandes
- Undo/redo de variaciones
- Persistencia en localStorage de variación seleccionada
- Internacionalización (i18n)

---
## 15. Licencia
Proyecto privado (sin licencia explícita). Agregar una licencia (MIT / Apache-2.0) si se planea distribución.

---
## 16. Resumen rápido (TL;DR)
React + Vite panel que:
- Stream Pixel Streaming (Arcware)
- Selecciona materiales y vistas
- Envía eventos JSON simples a Unreal vía `emitUIInteraction`
- Genera PDF del panel
- Ajusta tinte RGB enviado como floats 0..1

Listo para extender y tematizar.
