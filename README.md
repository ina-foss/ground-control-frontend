# Ground Control

Ground Control is an audio/video corpus annotation application developed by [INA](http://www.ina.fr) and distributed under an MIT license.
It is partially funded by BPI as part of the France 2030 [ArGiMi project](https://www.ina.fr/institut-national-audiovisuel/research/argimi-project).

Ground Control allows users to manage corpora, annotators, and task allocation strategies for annotators. There are several types of tasks, each with a dedicated screen. One of the main objectives of this application is to annotate audio transcripts while having synchronized access to the relevant media. The first screen currently in operation allows transcripts to be segmented and categorized. Others are under development, notably for the creation and fine annotation of spans within transcripts.

The application consists of a frontend, this project, and a backend API [available here](https://github.com/ina-foss/ground-control-backend). The [amalia.js video player](https://ina-foss.github.io/amalia.js/) is integrated.

# Ground Control Frontend

Ground Control frontend application designed for ground truth data management and secure client interaction with the Ground Control API backend.

## Description

Ground Control Frontend provides an intuitive, responsive web interface for managing ground truth data in machine learning workflows.

## Key Technologies & Techniques

- **Nuxt 3** - Full-stack Vue framework with server-side rendering and static generation
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development with enhanced IDE support
- **Pinia** - Modern state management for Vue with TypeScript support
- **PrimeVue** - Comprehensive UI component library with theming support
- **OIDC Client** - Standards-based authentication with Keycloak integration
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vitest** - Fast unit testing framework with coverage reporting
- **ESLint** - Code quality and consistency enforcement

## Notable Libraries & Dependencies

- **@ina/amalia** - Media player integration for video/audio content
- **@ina/kit-ui** - Custom UI components and design system
- @hey-api/openapi-ts - OpenAPI to TypeScript codegen for API services
- **oidc-client-ts** - OpenID Connect client library for authentication
- **hls.js** - HTTP Live Streaming support for media playback
- **markdown-it** - Markdown parsing and rendering
- **dompurify** - XSS protection for HTML sanitization
- **lodash** - Utility functions for JavaScript operations
- **socket.io** - Real-time bidirectional communication

## Project Structure

```
├── api/                        # API client generation and types
├── assets/                     # Uncompiled assets (CSS, images)
│   └── css/                    # Stylesheets and fonts
├── components/                 # Vue components
├── composables/               # Vue composition functions
├── directives/                # Custom Vue directives
├── layouts/                   # Application layouts
├── middleware/                # Route middleware
├── pages/                     # File-based routing pages
├── plugins/                   # Nuxt plugins
├── public/                    # Static files served directly
├── server/                    # Server-side code (API routes)
├── stores/                    # Pinia state management stores
├── tests/                     # Test suite (unit and integration)
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions and helpers
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vitest.config.ts           # Vitest testing configuration
└── config.json               # Application configuration
```

## Key Directories

- **components/** - Reusable Vue components organized by feature/domain
- **pages/** - File-based routing with automatic route generation
- **stores/** - Centralized state management with Pinia stores
- **composables/** - Shared composition functions for business logic
- **middleware/** - Authentication and route protection logic
- **api/** - Generated API client from OpenAPI specification

## Configuration

The application uses environment-based configuration through the `config.json` file and runtime configuration. Key configuration options include:

### Available Configuration Options

- **apiBasePath** - Backend API base URL (default: `http://localhost:8000`)
- **authorityUrl** - OIDC provider URL (default: `http://localhost:9080/realms/ground_control`)
- **clientId** - OIDC client identifier (default: `web_app`)
- **version** - Application version for cache busting and deployment tracking

## Features

- **🔐 Secure Authentication** - OIDC/Keycloak integration with automatic token refresh
- **🎨 Modern UI** - PrimeVue components with custom theming and dark mode support
- **🧪 Testing** - Comprehensive test suite with Vitest and Vue Testing Library
- **📹 Media Support** - Advanced video/audio playback with HLS streaming

## Quick Start

For detailed development setup instructions, see the [Developer Guide](.docs/developer-guide.md).

``
