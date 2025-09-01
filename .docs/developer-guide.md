# Developer Guide

## Prerequisites

Before starting development, ensure you have:

- **Node.js 18+** with npm package manager
- **Access to Ground Control API backend** - Running on `http://localhost:8000` by default
- **Keycloak instance** - For authentication (`http://localhost:9080/realms/ground_control` by default)

## Getting Started

### 1. Clone and Setup

```shell script
# Clone the repository
git clone <repository-url>
cd ground-control-frontend

# Install dependencies
npm install

# Copy and configure environment settings (if needed)
cp config.json.example config.json
```

### 2. Development Server

```shell script
# Start development server with hot reload
npm run dev

# The application will be available at http://localhost:3000
```

### 3. API Client Generation

The project uses OpenAPI code generation to create type-safe API clients:

```shell script
# Generate API client from backend OpenAPI spec
npm run update-api

# This creates/updates files in the ./api/generate directory

```

## Configuration

The application uses environment-based configuration through the `config.json` file and runtime configuration.

### config.json

The main application configuration file containing core settings for API communication and authentication:

```
json
{
  "apiBasePath": "http://localhost:8000",
  "authorityUrl": "http://localhost:9080/realms/ground_control",
  "clientId": "web_app",
  "version": "1.0.0"
}
```

#### Configuration Parameters

| Parameter      | Description                                                                                                                                                                            | Default Value                                 | Environment      |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------|
| `apiBasePath`  | **Backend API Base URL** - The root URL where the Ground Control API backend is hosted. All API requests will be prefixed with this URL.                                               | `http://localhost:8000`                       | Development      |
| `authorityUrl` | **OIDC Authority URL** - The complete URL to the Keycloak realm used for authentication. This includes the Keycloak server URL and the specific realm path (`/realms/ground_control`). | `http://localhost:9080/realms/ground_control` | Development      |
| `clientId`     | **OIDC Client Identifier** - The unique identifier for this frontend application as registered in Keycloak. Must match the client ID configured in the Keycloak admin console.         | `web_app`                                     | All environments |
| `version`      | **Application Version** - Used for cache busting, deployment tracking, and displaying version information in the UI. Should be updated with each release.                              | `1.0.0`                                       | All environments |

#### Environment-Specific Examples

**Development Configuration:**

```
json
{
  "apiBasePath": "http://localhost:8000",
  "authorityUrl": "http://localhost:9080/realms/ground_control",
  "clientId": "web_app",
  "version": "1.0.0"
}
```

**Production Configuration:**

```
json
{
  "apiBasePath": "https://api.groundcontrol.company.com",
  "authorityUrl": "https://auth.company.com/realms/ground_control",
  "clientId": "ground_control_web",
  "version": "2.1.0"
}
`

## Development Workflow

### Code Quality

```shell script
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking (if using TypeScript strict mode)
npm run type-check
```


### Testing

```shell script
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage

# Run tests with UI
npm run test:ui
```


### Testing Strategy

- **Unit Tests** - Individual component and utility testing
- **Integration Tests** - API integration and user workflow testing
- **Component Tests** - Vue component behavior and props testing
- **E2E Tests** - Full user journey testing (when configured)

## Theming and Styling

### PrimeVue Theming

The application uses a custom PrimeVue theme based on the Lara preset:

- **CSS Variables** - Dynamic theming with CSS custom properties
- **Dark Mode** - Automatic dark/light mode switching
- **Component Customization** - Tailored component styles

### Tailwind Integration

Tailwind CSS provides utility-first styling:

```vue template
<template>
  <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
    <!-- Responsive, accessible styling -->
  </div>
</template>
```


## Performance Optimization

### Build Optimization

- **Code Splitting** - Automatic route-based code splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Image and asset compression
- **Bundle Analysis** - Use `npm run analyze` to inspect bundle size

### Runtime Performance

- **Lazy Loading** - Components and routes loaded on demand
- **Caching** - API response caching with proper invalidation
- **Virtual Scrolling** - For large data sets
- **Debounced Inputs** - Reduced API calls for search/filter inputs

## Deployment

### Build Commands

```shell script
# Static Site Generation
npm run generate

# Server-Side Rendering
npm run build

# Preview production build
npm run preview
```
