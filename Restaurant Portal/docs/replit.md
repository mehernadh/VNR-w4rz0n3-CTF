# Overview

This is a restaurant management web application called RestaurantPro that appears to be designed as a Capture The Flag (CTF) cybersecurity challenge. The application simulates a vulnerable restaurant management system with intentionally embedded security flaws for educational purposes. It features user authentication, order management, review systems, and administrative functions, all implemented with deliberate vulnerabilities including SQL injection, IDOR (Insecure Direct Object References), and information disclosure through robots.txt.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture. It uses Vite as the build tool and development server, providing fast hot module replacement and optimized builds. The UI is constructed with shadcn/ui components, which are built on top of Radix UI primitives and styled with Tailwind CSS. The application implements client-side routing using Wouter for navigation between different pages (login, dashboard, admin panel, etc.).

State management is handled through a combination of Zustand for authentication state persistence and TanStack Query for server state management and API caching. The authentication system stores user sessions in local storage with automatic persistence across browser sessions.

## Backend Architecture
The backend is built with Express.js running on Node.js, serving both API endpoints and static files. The server implements a RESTful API design with routes for authentication, user management, orders, reviews, and administrative functions. In development mode, it integrates with Vite's middleware for seamless full-stack development experience.

The application uses an in-memory storage system (`MemStorage`) that simulates database operations without requiring an actual database connection. This approach was chosen for the CTF environment to simplify deployment while maintaining the appearance of a real application with intentional vulnerabilities.

## Data Storage Solutions
The project is configured to use Drizzle ORM with PostgreSQL for production environments, as evidenced by the database schema definitions and configuration files. However, the current implementation uses an in-memory storage layer that mimics database operations for educational purposes.

The schema defines four main entities: users (with authentication and role management), orders (customer order tracking), reviews (customer feedback system), and adminData (sensitive administrative information). All tables use UUID primary keys and include proper foreign key relationships.

## Authentication and Authorization
The authentication system implements JWT-like session management with role-based access control. Users can register and login through standard forms, with the system supporting both regular users and administrators. The frontend stores authentication state persistently and includes route protection based on user roles.

The system intentionally includes authentication bypasses and weak authorization checks as part of the CTF challenge, allowing unauthorized access to administrative functions through various exploit vectors.

## External Dependencies
The application integrates with Neon Database (@neondatabase/serverless) for PostgreSQL connectivity in production environments. It uses connect-pg-simple for PostgreSQL session storage when running with a real database.

The frontend leverages a comprehensive UI component library (Radix UI) for accessibility and consistent design patterns. TanStack Query provides robust data fetching, caching, and synchronization capabilities. The build system uses Vite with various plugins for development enhancement, including runtime error overlays and development banners specific to the Replit environment.

For styling, the application uses Tailwind CSS with a custom design system implementing CSS variables for theming support. The component architecture follows shadcn/ui conventions, providing a scalable and maintainable UI foundation.