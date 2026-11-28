# Zenith Product API

A RESTful API for managing the Zenith e-commerce product inventory, built with Node.js, Express and Mongoose (MongoDB Atlas). SBA 13.

## Setup

1. Clone the repo and install packages:
   ```
   npm install
   ```
2. Create a `.env` file in the project folder:
   ```
   MONGO_URI=your-mongodb-atlas-connection-string
   PORT=3000
   ```
3. Start the server:
   ```
   npm run dev
   ```
   You should see `MongoDB connected: zenith` and `Server is running on http://localhost:3000`.

## Project structure

```
server.js               starts Express, connects the database, mounts routes
config/connection.js    connects to MongoDB with success and error logging
models/Product.js       Product schema and model
routes/productRoutes.js all /api/products endpoints
```

## Product fields

| Field       | Type     | Rules                            |
| ----------- | -------- | -------------------------------- |
| name        | String   | required                         |
| description | String   | required                         |
| price       | Number   | required, must be greater than 0 |
| category    | String   | required                         |
| inStock     | Boolean  | defaults to true                 |
| tags        | [String] | optional                         |
| createdAt   | Date     | defaults to now                  |

## Endpoints

| Method | URL               | What it does                                  | Success       | Errors                    |
| ------ | ----------------- | --------------------------------------------- | ------------- | ------------------------- |
| POST   | /api/products     | Create a product                              | 201           | 400 validation            |
| GET    | /api/products     | List products (with filters below)            | 200           | 400 bad params            |
| GET    | /api/products/:id | Get one product                               | 200           | 404 not found, 400 bad id |
| PUT    | /api/products/:id | Update a product, returns the updated version | 200           | 404, 400                  |
| DELETE | /api/products/:id | Delete a product                              | 200 + message | 404, 400                  |

## Query options for GET /api/products

| Param    | Example                             | What it does                   |
| -------- | ----------------------------------- | ------------------------------ |
| category | `?category=kitchen`                 | only that category             |
| minPrice | `?minPrice=20`                      | price greater than or equal to |
| maxPrice | `?maxPrice=90`                      | price less than or equal to    |
| sortBy   | `?sortBy=price_asc` or `price_desc` | sort by price                  |
| page     | `?page=2`                           | which page (default 1)         |
| limit    | `?limit=5`                          | products per page (default 10) |

They combine, for example:

```
/api/products?category=electronics&minPrice=20&sortBy=price_desc&page=1&limit=2
```

## Example POST body

```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling over-ear headphones",
  "price": 149.99,
  "category": "electronics",
  "tags": ["audio", "wireless"]
}
```
