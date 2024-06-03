import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test:{
        environment:'nuxt',
        globals: true,
        setupFiles: 'tests/setup.ts',
        reporters: [
            'default',
            'junit',
            'html'
        ],
        outputFile: {
            junit: '.test_reports/junit-report.xml',
            html: '.test_reports/html/html-report.html',
        },
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '/api/**',
            '**/tests/pages/**', // exclude specific directories
            '**/*.config.ts',   // exclude files with specific patterns
            '**/*.test.skip.ts'   // exclude files with specific patterns
        ],
    }
})