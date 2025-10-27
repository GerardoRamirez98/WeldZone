# WeldZone

Aplicación web para mostrar y gestionar el catálogo de productos de **WeldZone**.

Construida con: **Vite + React 19 + TypeScript + Tailwind CSS v4 + Radix UI + React Query + Zustand**.

---

## Características

- Diseño responsivo (móvil, tablet y escritorio).
- Catálogo con búsqueda, filtros por categoría, precio y etiquetas.
- Cards de producto con altura uniforme e imágenes optimizadas.
- Carrito con envío de pedido por WhatsApp (mensaje estructurado).
- Exportación del catálogo a PDF (opcionalmente incluye imágenes).
- Modo oscuro/claro con persistencia.
- Panel de administración para productos, categorías, etiquetas y configuración (WhatsApp, mantenimiento).

Nota de negocio: actualmente no realizamos envíos. La entrega es por recolección en tienda (coordinamos día y hora).

---

## Rutas principales

- `/` Inicio
- `/catalogo` Catálogo de productos
- `/como-comprar` Guía paso a paso para cotizar/comprar
- `/contacto` Ubicación, contacto y horarios
- `/nosotros` Información de la empresa
- `/admin` Panel (rutas protegidas) — incluye `/admin/products` y `/admin/config`

---

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+ o pnpm/yarn equivalente

---

## Instalación y uso

1) Instalar dependencias

```bash
npm install
```

2) Variables de entorno

Crea `.env` (o usa `.env.development`/`.env.production`) y define:

```bash
VITE_API_URL="https://tu-backend.example.com"
```

3) Desarrollo

```bash
npm run dev
```

4) Compilar y previsualizar

```bash
npm run build
npm run preview
```

Scripts útiles:

- `npm run lint` — Linter
- `npm run typecheck` — Comprobación de tipos

---

## Estructura del proyecto

```bash
weldzone/
├── public/
├── src/
│   ├── api/                # Cliente HTTP y módulos API
│   ├── components/         # Header, Footer, ProductCard, etc.
│   ├── hooks/              # React Query + hooks varios
│   ├── pages/              # Home, Catalogo, ComoComprar, Contacto, Admin, errores
│   ├── assets / styles     # Recursos y estilos
│   ├── App.tsx             # Enrutamiento principal
│   └── main.tsx            # Punto de entrada
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## Flujo de compra (resumen)

1) Explora el catálogo y usa los filtros.  
2) Agrega productos al carrito.  
3) Abre el carrito y pulsa “Enviar pedido por WhatsApp”.  
4) Recibe cotización y coordina pago.  
5) Recolecta tu pedido en tienda (no hay envíos por el momento).

En el sitio: consulta la guía completa en `/como-comprar`.

---

## Despliegue

El proyecto está preparado para Vite. Puedes desplegar en Vercel, Netlify u otra plataforma estática.  
Ajusta `VITE_API_URL` para apuntar al backend correspondiente.

---

## Licencia

Proyecto de uso interno para WeldZone.  
© 2025 Todos los derechos reservados.

