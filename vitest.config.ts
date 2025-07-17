import { defineVitestConfig } from '@nuxt/test-utils/config'


export default defineVitestConfig({
    test:{
        watch: false,
        environment:'nuxt',
        environmentMatchGlobs:[
            ['tests', 'jsdom']
        ],
        globals: true,
        setupFiles: 'tests/setup.ts',
      onConsoleLog(log: string, type: 'stdout' | 'stderr'): false | undefined {
        if (log === 'message from third party library' && type === 'stdout') {
          return false;
        }
      },
        reporters: [
            'default',
            'verbose',
            'junit',
            'html'
        ],
        outputFile: {
            junit: './test-results/junit/junit-report.xml',
            html: './test-results/junit/html/html-report.html',
        },
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '/api/**',
            '**/shared/**',
            '**/tests/app.test.ts',
            // '**/tests/pages/**', // exclude specific directories
            '**/*.config.ts',   // exclude files with specific patterns
            '**/*.test.skip.ts',   // exclude files with specific patterns
            '**/public/**',

        ],
        coverage:{
          provider: 'istanbul',
          reporter: ['text','html','lcov'],
          reportsDirectory: './coverage',
          exclude:[
            '**/node_modules/**',
            '**/dist/**',
            '**/api/**',
            '**/shared/**',
            '**/presets/**',
            '**/*.config.ts',
            '**/public/**',
            '**/utils/**',
            '**/test-results/**',
            '**/plugins/**',
            '**/middleware/**',
            '**/directives/**',
            '**/composables/**',
            '**/.test_reports/**',
            '**/.nuxt/**',
            '**/.coverage/**',
            '**/tailwind.config.js',
            '**/**nuxt**',

          ]
        },
    }
})
