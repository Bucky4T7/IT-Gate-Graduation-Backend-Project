# E-COMMERCE NODE.JS / EXPRESS BACKEND

## Project Overview

This project aims to develop a complete, production-ready RESTful E-commerce backend using Node.js and Express. The backend will support various functionalities including user authentication and authorization, product management, order processing, wishlists, and reviews. Special attention will be given to system design, API quality, security, maintainability, and testing.

## Goals

- **CRUD Operations:** Implement Create, Read, Update, Delete functionalities for User, Item (Product), Category, Wishlist, Order, Review, and Dashboard entities.
- **Authentication & Authorization:** Secure API endpoints with role-based access control (Admin, User, Manager) using JWT (Access and Refresh tokens).
- **File Uploads:** Enable product image uploads (up to 5 images per product) with validation for size and type, utilizing Multer.
- **Database Management:** Use MongoDB as the primary database for persistent storage and Redis for temporary data storage and caching, including OTPs for email verification.
- **Email Verification:** Implement a robust email verification flow using Nodemailer for sending OTPs, with OTPs stored temporarily in Redis.
- **Middleware:** Develop and integrate essential middleware for centralized error handling, request validation (Zod or Joi), authentication, rate limiting, and CORS.
- **API Documentation:** Provide comprehensive API documentation, preferably for Postman.
- **Production Readiness:** Ensure the application is production-ready with proper environment configuration, secret management, and health check APIs.
- **Version Control:** Maintain a well-organized GitHub repository with a clear README, `.gitignore` file, and an `env.example` file.
- **Deployment:** Facilitate deployment to Render with auto-deployment on pushes to the main branch.

## Tech Stack

- **Backend Framework:** Node.js (LTS) + Express
- **Database:** MongoDB (Atlas or self-hosted)
- **Caching/Temporary Storage:** Redis
- **File Uploads:** Multer
- **Email Service:** Nodemailer
- **Authentication:** JWT (JSON Web Tokens)
- **Request Validation:** Zod or Joi

## Project Structure
```
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.js        # Database connection setup
│   │   ├── redis.js          # Redis connection setup
│   │   └── environment.js    # Environment variables configuration
│   │
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── item.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   └── wishlist.controller.js
│   │
│   ├── middlewares/         # Custom middleware functions
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/             # Database models
│   │   ├── user.model.js
│   │   ├── item.model.js
│   │   ├── order.model.js
│   │   ├── review.model.js
│   │   └── wishlist.model.js
│   │
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── item.routes.js
│   │   ├── order.routes.js
│   │   ├── review.routes.js
│   │   └── wishlist.routes.js
│   │
│   ├── services/         # Business logic
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── user.service.js
│   │   └── upload.service.js
│   │
│   ├── utils/           # Utility functions and helpers
│   │   ├── jwt.utils.js
│   │   ├── password.utils.js
│   │   └── validation.schemas.js
│   │
│   └── app.js          # Express app setup
│
├── tests/             # Test files
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── uploads/          # File upload directory
├── logs/            # Application logs
├── .env             # Environment variables
├── .env.example     # Environment variables example
├── .gitignore       # Git ignore file
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## API Endpoints Summary

### Auth Endpoints
- `/auth/register` (POST): Register new user, send OTP.
- `/auth/verify-otp` (POST): Verify OTP, activate account.
- `/auth/login` (POST): Login, return Access & Refresh tokens.
- `/auth/refresh` (POST): Issue new Access token.
- `/auth/logout` (POST): Delete Refresh token.
- `/auth/forgot-password` (POST): Send reset OTP/email link.
- `/auth/reset-password` (POST): Reset password with OTP/token.

### User Endpoints
- `/users/me` (GET): Get logged-in user profile.
- `/users/me` (PATCH): Update logged-in user profile.
- `/users/me` (DELETE): Soft delete logged-in user profile.
- `/users/me/avatar` (POST): Upload/change profile picture.
- `/users/me/change-password` (PATCH): Change password.

### Admin Endpoints
- `/admin/users` (GET): Get all users with filters.
- `/admin/users/:id` (GET): Get user by ID.
- `/admin/users/:id/block` (PATCH): Block user.
- `/admin/users/:id/unblock` (PATCH): Unblock user.
- `/admin/users/:id/role` (PATCH): Change user role.
- `/admin/users/:id/delete` (DELETE): Delete user (soft delete).
- `/admin/profile` (PATCH): Update admin's own profile.

### Manager Endpoints
- `/manager/admins` (GET): Get list of admins.
- `/manager/admins` (POST): Add new admin.
- `/manager/admins/:id` (DELETE): Delete an admin.
- `/manager/admins/:id/role` (PATCH): Change admin role.

### Item Endpoints
- `/items` (POST): Create new item (max 5 images).
- `/items` (GET): Get all items with filters, pagination & sorting.
- `/items/filter` (GET): Filter items by categoryId or categoryName.
- `/items/:id` (GET): Get single item details.
- `/items/:id` (PATCH): Update item.
- `/items/:id` (DELETE): Delete item (soft delete).

### Order Endpoints
- `/orders` (POST): Create new order.
- `/orders/my` (GET): Get logged-in user orders.
- `/orders/:id` (GET): Get specific order details.
- `/orders/:id/cancel` (PATCH): Cancel order if status = Pending.
- `/orders` (GET): Get all orders (Admin/Manager).
- `/orders/:id/status` (PATCH): Update order status (Admin/Manager).

### Wishlist Endpoints
- `/wishlist` (GET): Get logged-in user wishlist.
- `/wishlist/:itemId` (POST): Add item to wishlist.
- `/wishlist/:itemId` (DELETE): Remove item from wishlist.

### Review Endpoints
- `/reviews/:itemId` (GET): Get all reviews for an item.
- `/reviews/:itemId` (POST): Add review for an item.
- `/reviews/:id` (PUT): Update own review.
- `/reviews/:id` (DELETE): Delete own review.
- `/reviews` (GET): Get all reviews (Admin/Manager).

