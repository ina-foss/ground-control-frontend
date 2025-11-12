# Ground Control Frontend - Developer Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Video Content Management](#video-content-management)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Docker Development](#docker-development)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Docker**: Version 20.x or higher (for containerized development)
- **Docker Compose**: Version 2.x or higher

### Recommended IDE Setup

- **Visual Studio Code** or **JetBrains WebStorm**
- Extensions (for VS Code):
  - Volar (Vue Language Features)
  - TypeScript Vue Plugin
  - ESLint
  - Tailwind CSS IntelliSense
  - Docker

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd front
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create or verify the `public/config.json` file:
```json
{
"apiBasePath": "http://localhost:8000",
"authorityUrl": "http://localhost:9080/realms/ground_control",
"clientId": "web_app",
"version": "1.0.0"
}
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

## Development Workflow

### Running the Development Server
```bash
npm run dev
```
This starts the Nuxt development server with:
- Hot Module Replacement (HMR)
- TypeScript checking
- Auto-import of components and composables
- Automatic routing based on `pages/` directory

### Code Quality

#### Linting
```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```
#### Type Checking
```bash
# Run TypeScript type checking
npx nuxi typecheck
```

### Project Structure Best Practices

- **components/**: Place reusable Vue components here
  - Use PascalCase for component names
  - Organize by feature/domain when possible
  
- **composables/**: Create composition functions here
  - Use `use` prefix (e.g., `useAuth`, `useApi`)
  - Export as named exports
  
- **pages/**: File-based routing
  - File name determines the route
  - Use `index.vue` for root routes
  - Use `[id].vue` for dynamic routes
  
- **stores/**: Pinia stores for state management
  - One store per domain/feature
  - Use `defineStore` with setup syntax
  
- **types/**: TypeScript type definitions
  - Global types in `types/index.ts`
  - API types auto-generated in `api/`

## Video Content Management

The application includes a Video-on-Demand (VOD) system powered by nginx-vod-module that supports HLS, DASH, and MSS streaming protocols.

### Adding Video Files

#### 1. Prepare Your Video Files

Place your video files in the `videos/` directory at the project root:
```bash
# Structure
front/
├── videos/
│   ├── demo.mp4
│   └── your-video.mp4
└── ...
```

**Supported formats:**
- MP4 (H.264/H.265)
- MOV
- M4V
- WebM

**Recommendations:**
- Use H.264 codec for maximum compatibility
- Keep file sizes reasonable for streaming
- Use meaningful filenames (lowercase, no spaces)

#### 2. Video Mounting in Docker

The `videos/` directory is automatically mounted as a Docker volume in `docker-compose`:
```yaml
volumes:
- ../videos:/usr/share/nginx/html/videos
```
This means:
- Videos are **not** built into the Docker image
- You can add/remove videos without rebuilding
- Changes are immediately available after container restart

#### 3. Accessing Videos

Once your videos are in the `videos/` directory and the container is running, they're available via multiple protocols:

##### HLS (HTTP Live Streaming)
```
http://localhost/vod/{filename}/master.m3u8
```

Example:
```
http://localhost/vod/demo.mp4/master.m3u8
```

##### DASH (Dynamic Adaptive Streaming)
```
http://localhost/dash/{filename}/manifest.mpd
```
Example:
```

http://localhost/dash/demo.mp4/manifest.mpd
```
##### MSS (Microsoft Smooth Streaming)
```

http://localhost/mss/{filename}/Manifest
```
Example:
```

http://localhost/mss/demo.mp4/Manifest
```
##### Direct MP4 Access
```
http://localhost/videos/{filename}
```
Example:
```
http://localhost/videos/demo.mp4
```

#### 4. Using Videos in Your Application

**In Vue components:**
```vue

<template>
<video controls>
<source :src="videoUrl" type="video/mp4">
</video>

  <!-- Or with HLS.js for adaptive streaming -->
<video ref="videoPlayer" controls></video>
</template>

<script setup lang="ts">
import Hls from 'hls.js'

const videoPlayer = ref<HTMLVideoElement>()
const videoUrl = '/vod/demo.mp4/master.m3u8'

onMounted(() => {
  if (Hls.isSupported() && videoPlayer.value) {
    const hls = new Hls()
    hls.loadSource(videoUrl)
    hls.attachMedia(videoPlayer.value)
  }
})
</script>
```

**With Amalia player:**

```vue

<template>
  <div ref="amaliaContainer"></div>
</template>

<script setup lang="ts">
const amaliaContainer = ref<HTMLElement>()

onMounted(() => {
  if (amaliaContainer.value) {
    new window.fr.ina.amalia.player.Player({
      container: amaliaContainer.value,
      src: '/vod/demo.mp4/master.m3u8',
      autoplay: false
    })
  }
})
</script>
```

#### 5. Restart Container After Adding Videos
```bash
# If container is running
docker-compose -f .dev/app.yml restart

# Or stop and start
docker-compose -f .dev/app.yml down
docker-compose -f .dev/app.yml up -d
```

#### 6. Verify Video Availability
```bash
# Check videos in container
docker exec -it ground-control-frontend ls -la /usr/share/nginx/html/videos/

# Test HLS manifest generation
curl http://localhost/vod/demo.mp4/master.m3u8
```

### Video Configuration

The VOD module configuration can be adjusted in `.dev/nginx.conf`:
```nginx

# Segment duration (in milliseconds)
vod_segment_duration 6000;  # 6 seconds

# Align segments to keyframes
vod_align_segments_to_key_frames on;

# Cache settings (in http block)
vod_metadata_cache metadata_cache 512m;
vod_response_cache response_cache 128m;
vod_mapping_cache mapping_cache 64m;
```

### Troubleshooting Videos

**Video not found (404):**
- Verify file exists in `videos/` directory
- Check Docker volume is mounted: `docker inspect ground-control-frontend`
- Ensure filename in URL matches actual filename

**Video won't play:**
- Check codec compatibility (use H.264)
- Verify file isn't corrupted: `ffmpeg -i videos/yourfile.mp4`
- Check browser console for errors

**Poor streaming performance:**
- Reduce segment duration in nginx.conf
- Optimize video bitrate
- Increase cache sizes

## Testing

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```
### Component Testing
```bash
# Run component tests
npm run test:unit
```
Tests are written using:
- **Vitest**: Test runner
- **@vue/test-utils**: Vue component testing
- **@testing-library/vue**: Testing utilities

Example test structure:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
it('renders properly', () => {
const wrapper = mount(MyComponent, {
props: { msg: 'Hello' }
})
expect(wrapper.text()).toContain('Hello')
})
})
```

### End-to-End Tests

E2E tests use Playwright:
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

## Building for Production

### Local Build
```bash
# Generate static files
npm run build

# Preview production build
npm run preview
```

The build output will be in `.output/public/`

### Docker Build
```bash
# Build Docker image
docker-compose -f .dev/app.yml build

# Run production container
docker-compose -f .dev/app.yml up -d
```

The Dockerfile uses multi-stage builds:
1. **Builder stage**: Builds the Nuxt application
2. **Nginx builder stage**: Compiles nginx with VOD module
3. **Runtime stage**: Runs nginx serving the built application

## Docker Development

### Start Development Environment
```bash
cd .dev
docker-compose -f app.yml up -d
```

### View Logs

```bash
docker-compose -f .dev/app.yml logs -f
```

### Stop Environment

```bash
docker-compose -f .dev/app.yml down
```

### Rebuild Container
```bash
# Rebuild without cache
docker-compose -f .dev/app.yml build --no-cache

# Rebuild and start
docker-compose -f .dev/app.yml up -d --build
```

### Access Container Shell
```bash
docker exec -it ground-control-frontend sh
```

### Health Check
```bash
# Check if nginx is healthy
curl http://localhost/health

# Check VOD module status
curl http://localhost/vod_status
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 80
lsof -i :80

# Kill the process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Nuxt Cache Issues
```bash
# Clear Nuxt cache
rm -rf .nuxt .output
npm run dev
```
#### Docker Build Failures
```bash
# Clean Docker system
docker system prune -a

# Rebuild from scratch
docker-compose -f .dev/app.yml build --no-cache
```

#### Authentication Issues

- Verify Keycloak is running at the configured `authorityUrl`
- Check `public/config.json` has correct settings
- Clear browser cache and cookies
- Check browser console for CORS errors

## Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [PrimeVue Documentation](https://primevue.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [nginx-vod-module Documentation](https://github.com/kaltura/nginx-vod-module)
