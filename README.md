# ⚡ Dashboard App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-5.19-2d3748)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff)

A modern, high-performance dashboard application built for managing agencies and contacts. Featuring a "Modern Minimalist" aesthetic with an "Ethereal Zinc" design system, this project demonstrates the power of the latest web technologies.

## 🌟 Features

### 🎨 Design & UI
-   **Modern Minimalist Aesthetic**: Clean lines, subtle borders, and a refined Zinc/Slate color palette.
-   **Dark Mode Support**: Fully dynamic light/dark mode switching with system preference detection.
-   **Responsive Layout**: Optimized for all devices, from mobile phones to large desktop screens.
-   **Smooth Animations**: Staggered fade-ins, slide-ups, and micro-interactions powered by CSS animations.

### 🛠️ Functionality
-   **Secure Authentication**: Robust user management powered by Clerk.
-   **Dashboard Analytics**: Real-time overview of total agencies, contacts, and daily usage limits.
-   **Agency Management**: Searchable, sortable, and paginated list of agencies.
-   **Contact Access**: Controlled access to contact details with a daily view limit (50/day).
-   **Smart Pagination**: "Page X of Y" indicators and mobile-friendly navigation controls.

## 🏗️ Architecture

The application is built on a robust Next.js serverless architecture.

```mermaid
graph TD
    subgraph Client ["🖥️ Frontend (Client)"]
        UI[User Interface]
        Auth[Clerk Auth Provider]
        Theme[Theme Context]
        
        UI -->|Auth Check| Auth
        UI -->|Style| Theme
    end

    subgraph Server ["☁️ Backend (Server Actions/API)"]
        Router[App Router]
        Controller[API Handlers]
        ORM[Prisma Client]
        
        Router --> Controller
        Controller --> ORM
    end

    subgraph Data ["🗄️ Data Layer"]
        DB[(Database)]
    end

    User((👤 User)) -->|HTTPS Request| Router
    User -->|Interaction| UI
    UI -->|Fetch Data| Router
    ORM -->|Query| DB
```

## 💻 Tech Stack

| Technology | Description |
|------------|-------------|
| **[Next.js 16](https://nextjs.org/)** | The React Framework for the Web (App Router & Server Actions). |
| **[React 19](https://react.dev/)** | The library for web and native user interfaces. |
| **[Tailwind CSS 4](https://tailwindcss.com/)** | A utility-first CSS framework for rapid UI development. |
| **[Prisma](https://www.prisma.io/)** | Next-generation Node.js and TypeScript ORM. |
| **[Clerk](https://clerk.com/)** | Complete user management and authentication solution. |
| **[TypeScript](https://www.typescriptlang.org/)** | Strongly typed programming language that builds on JavaScript. |

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/dashboard-app.git
    cd dashboard-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/dashboard"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."
    ```

4.  **Initialize Database**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Visit `http://localhost:3000` to view the application.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── dashboard/        # Dashboard Pages
│   └── ...
├── components/           # Reusable UI Components
│   ├── AgencyCard.tsx    # Agency Display Component
│   ├── ContactCard.tsx   # Contact Display Component
│   └── ...
└── lib/                  # Utilities & Configuration
    └── prisma.ts         # Prisma Client Instance
```
