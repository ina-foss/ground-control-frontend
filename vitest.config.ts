import { defineVitestConfig } from '@nuxt/test-utils/config'


export default defineVitestConfig({
    test:{
        environment:'nuxt',
        environmentMatchGlobs:[
            ['tests', 'jsdom']
        ],
        globals: true,
        setupFiles: 'tests/setup.ts',
      onConsoleLog(log: string, type: 'stdout' | 'stderr'): false | void {
        console.log('log in test: ', log);
        if (log === 'message from third party library' && type === 'stdout') {
          return false;
        }
      },
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
