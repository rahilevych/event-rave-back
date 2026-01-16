# ⚙️ Event Rave — Backend API

<p align="left">
  <a href="https://event-rave-back.onrender.com/api" target="_blank">
    <img src="https://img.shields.io/badge/Swagger_API-📖-green?style=for-the-badge&logo=swagger" alt="Swagger">
  </a>
  <a href="https://event-rave.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-🕺-blue?style=for-the-badge" alt="Frontend">
  </a>
    <a href="https://github.com/rahilevych/event-rave" target="_blank">
    <img src="https://img.shields.io/badge/Frontend_Repository-⚙️-white?style=for-the-badge" alt="Frontend">
  </a>
</p>

> [!NOTE]
> The API is hosted on a free Render tier. Initial requests may experience a delay of up to 1 minute due to "sleep mode" Please wait a little bit for the server to wake up.

A **NestJS** server for the Event Rave frontend. This project was developed to master authentication flows, strict modular architecture, and modern ORM integration.

---

## 🎯 Project Goals
* Implementation of dual-token JWT strategy (Access & Refresh) with rotation
* Implement authentication using OAuth 2.0 protocol 
* Integration of **Prisma ORM** with **PostgreSQL** (Neon DB)
* Following NestJS achitecture for modularity and scalability

## 🛠 Tech Stack
* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL (via Neon DB)
* **ORM:** Prisma
* **Security:** Passport.js, JWT, bcrypt
* **API Docs:** Swagger (OpenAPI)

## 🏗 Modular Structure (`src/`)
The project is divided into specialized modules to ensure high maintainability:
- `auth/`: Core authentication logic (Login/Register)
- `github-auth/`: OAuth2 flow for GitHub provider
- `token/`: Logic for generating and rotating Access/Refresh tokens
- `users/`: User profile and data management
- `events/`: Event CRUD, search, and filtering
- `categories/`: Event categorization management
- `likes/`: Wishlist logic (managing favorites)
- `database/`: Prisma service configuration
- `common/`: Shared guards, decorators, and global filters

## 🔐 Authentication Strategy
1.  **Access Token:** Short-lived, used for authorizing API requests
2.  **Refresh Token:** Long-lived, used to obtain new access tokens, saved in DB
3.  **Rotation:** Every time a new token is issued, the old refresh token is invalidated to prevent attacks
4.  **GitHub OAuth2:** Users can securely authenticate using their GitHub accounts



## 🛣 API Routes Overview

| Method | Endpoint | Description | 
| :--- | :--- | :--- | 
| **POST** | `/auth/login` | User login |
| **POST** | `/auth/logout` | User logout |
| **POST** | `/auth/refresh` | Refresh tokens |
| **GET** | `/github-auth` | Initiate GitHub OAuth flow |
| **GET** | `/github-auth/oauth/callback` | Callback to get user data |
| **GET** | `/users/me` | Get current user profile |
| **POST** | `/users/register` | Create new user |
| **PATCH** | `/users/:id` | Update user data |
| **DELETE** | `/users/me` | Delete user account |
| **GET** | `/categories` | All categories |
| **GET** | `/categories/:id` | Get category by id |
| **GET** | `/events` | Get events | 
| **GET** | `/events/liked` | Get liked events | 
| **GET** | `/events/:id` | Get detailed event information |
| **PUT** | `/likes/:eventId/toggle` | Toggle event in wishlist |

*For more details, please visit the [Swagger UI](https://event-rave-back.onrender.com/api).*

## 🚀 Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://user:pass@host/db
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
GITHUB_REDIRECT_URL=your_api_url/github-auth/oauth/callback
FRONTEND_URL=your_frontend_url
