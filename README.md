# Raco frontend

Dark-themed React frontend for the `raco_ecommerce` Django backend, built with Vite + React Router.

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your Django API
npm run dev
```

Runs at http://localhost:5173.

## What's included

- **Home** — hero + featured products
- **Products** — category tree sidebar, search, sort, pulled from `/products/` and `/categories/`
- **Product detail** — quantity picker, add to cart
- **Cart** — persisted to localStorage, live subtotal/shipping/total (free shipping over 2000)
- **Checkout** — shipping address form + Stripe/bKash provider selection, matching the payments strategy pattern
- **Login / Register** — JWT auth, access token auto-refresh on 401
- **Orders / Order detail** — order history and status

## Wiring to your Django API

All requests go through `src/api/client.js`. The endpoint paths there are guesses based on your `apps/` structure (`users`, `categories`, `products`, `orders`, `payments`) — open that file and adjust the paths to match your actual DRF router URLs, in particular:

- `POST /users/token/` and `/users/token/refresh/` — swap for `djangorestframework-simplejwt` defaults or your own auth URLs
- `POST /payments/checkout/` — should return `{ redirect_url }` for Stripe Checkout / bKash redirect, or nothing if payment is confirmed synchronously
- `GET /categories/` — expected to return a nested tree (`children: [...]`) since `CategorySidebar` renders it recursively; flatten-and-nest client-side if your API returns a flat list instead

CORS: make sure `django-cors-headers` allows `http://localhost:5173` in development.

## Notes

- Home and Products fall back to sample data if the API call fails, so the UI is inspectable before the backend is wired up.
- Cart state lives in `CartContext` (localStorage), auth state in `AuthContext`.
- Styling is plain CSS with custom properties in `src/styles/index.css` — no Tailwind, so there's nothing to configure.
