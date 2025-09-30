# MovieBase

A full-stack movie management application built with Next.js (frontend) and NestJS (backend).

## 🚀 Live Demo

- **Frontend URL**: http://ec2-13-126-220-153.ap-south-1.compute.amazonaws.com:8000/
- **Backend API Documentation**: http://ec2-65-0-112-79.ap-south-1.compute.amazonaws.com:3000/api/docs

## 🔐 Test Credentials

- **Email**: demo123@dev.in
- **Password**: 12345678

## 📋 Project Overview

### Frontend (Client)

- **Technology**: Next.js 14 with TypeScript
- **UI Components**: Custom UI components with modern design
- **Features**:
  - User authentication (login/signup)
  - Movie listing and management
  - Create, edit, and delete movies
  - File upload functionality for movie posters
  - Responsive design with pagination
  - Protected routes with JWT authentication

### Backend (Server)

- **Technology**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Features**:
  - RESTful API endpoints
  - User registration and login
  - Movie CRUD operations
  - File upload handling
  - Input validation with DTOs
  - Error handling and exception filters
  - Swagger API documentation

## 🛠️ Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (API calls)

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Swagger/OpenAPI
- Multer (file uploads)

## 📁 Project Structure

```
moviebase/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # API utilities
│   │   └── store/        # State management
│   └── package.json
├── server/                # NestJS backend application
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── movies/       # Movies module
│   │   ├── upload/       # File upload module
│   │   └── common/       # Shared utilities
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd moviebase
```

2. Install dependencies for both client and server

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

3. Set up environment variables

   - Create `.env` files in both `client/` and `server/` directories
   - Configure database connection, JWT secrets, and API endpoints

4. Start the development servers

```bash
# Start backend server (from server directory)
pnpm run start:dev

# Start frontend server (from client directory)
pnpm run dev
```

## 📚 API Documentation

The backend API is fully documented with Swagger. Visit the API documentation at:
http://ec2-65-0-112-79.ap-south-1.compute.amazonaws.com:3000/api/docs

## 🔧 Available Scripts

### Frontend (Client)

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Backend (Server)

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Build the application
- `pnpm run start:prod` - Start production server
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests

## 🌟 Features

- **User Authentication**: Secure login and registration system
- **Movie Management**: Full CRUD operations for movies
- **File Upload**: Upload movie posters and images
- **Responsive Design**: Mobile-friendly interface
- **API Documentation**: Comprehensive Swagger documentation
- **Type Safety**: Full TypeScript support across the stack
- **Modern UI**: Clean and intuitive user interface

## 📝 License

This project is licensed under the MIT License.
