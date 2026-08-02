# API Integration

## Public Catalog

| Frontend feature | Endpoint |
| --- | --- |
| Featured and filtered equipment | `GET /gear` |
| Equipment details | `GET /gear/:id` |
| Categories | `GET /categories` |
| Equipment reviews | `GET /reviews?gearItemId=:id` |

## Authentication

| Frontend feature | Endpoint |
| --- | --- |
| Registration | `POST /auth/register` |
| Login | `POST /auth/login` |
| Current profile | `GET /auth/me` |
| Profile update | `PATCH /auth/me` |
| Logout | `POST /auth/logout` |

## Customer

| Frontend feature | Endpoint |
| --- | --- |
| Create rental request | `POST /rentals` |
| Paginated rental history | `GET /rentals?page=:page&limit=:limit` |
| Create Stripe Checkout session | `POST /payments/create` |
| Stripe success verification | `GET /payments/success?session_id=:sessionId` |
| Paginated payment history | `GET /payments?page=:page&limit=:limit` |
| Submit review | `POST /reviews` |

## Provider

| Frontend feature | Endpoint |
| --- | --- |
| Paginated equipment inventory | `GET /provider/gear?page=:page&limit=:limit` |
| Create equipment | `POST /provider/gear` |
| Update equipment | `PUT /provider/gear/:id` |
| Delete equipment | `DELETE /provider/gear/:id` |
| Rental fulfillment | `GET /provider/orders`, `PATCH /provider/orders/:id` |

## Admin

| Frontend feature | Endpoint |
| --- | --- |
| Dashboard statistics | `GET /admin/stats` |
| User management | `GET /admin/users`, `PATCH /admin/users/:id` |
| Category management | `GET /categories`, `POST /categories`, `DELETE /categories/:id` |
| Platform moderation | `GET /admin/gear`, `GET /admin/rentals`, `GET /admin/payments`, `GET /admin/reviews`, `DELETE /admin/reviews/:id` |
