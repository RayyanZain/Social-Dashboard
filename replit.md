# Overview

This is a social media dashboard application built to monitor and manage social media automation workflows across multiple platforms (Instagram, TikTok, LinkedIn, Twitter). The system aggregates data from existing MySQL database tables that track social media post automation logs and provides a centralized dashboard for brand management and post analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: ShadCN/UI components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MySQL database (existing) with custom storage interface abstraction
- **API Design**: RESTful API endpoints for CRUD operations on brands and social media posts
- **Development Setup**: Full-stack setup with Vite dev server proxy for API requests

## Data Storage
- **Primary Database**: MySQL database (`vyrade_post_logs`) with three main tables:
  - `brands`: Brand information and metadata
  - `social_instagram_tiktok`: Instagram and TikTok post automation logs
  - `social_linkedin_twitter`: LinkedIn and Twitter post automation logs
- **Schema Management**: Custom TypeScript interfaces for type safety
- **Data Access**: Abstract storage interface allowing for future database migration flexibility

## Core Features
- **Dashboard Overview**: Aggregated metrics, charts, and recent posts across all platforms
- **Brand Management**: CRUD operations for managing brand entities
- **Platform-Specific Views**: Separate views for Instagram/TikTok and LinkedIn/Twitter post logs
- **Filtering System**: Multi-dimensional filtering by brand, date range, and platform
- **Real-time Updates**: Automatic data refreshing and optimistic updates

## Design Patterns
- **Repository Pattern**: Storage abstraction layer for database operations
- **Component Composition**: Reusable UI components following atomic design principles
- **Type Safety**: End-to-end TypeScript with shared schema validation
- **Responsive Design**: Mobile-first approach with adaptive sidebar navigation

# External Dependencies

## UI and Styling
- **ShadCN/UI**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessibility and interactions
- **Lucide React**: Icon library for consistent iconography

## Data and State Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

## Database and Backend
- **MySQL2**: MySQL database driver for Node.js
- **Express.js**: Web application framework for API endpoints
- **Drizzle ORM**: Type-safe ORM (configured but using custom storage layer)

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Charts and Visualization
- **Recharts**: React charting library for dashboard analytics and data visualization