import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test:{
        environment:'nuxt',
        globals: true,
        reporters: [
            'default',
            'junit',
            'html'
        ],
        outputFile: {
            junit: '.test_reports/junit-report.xml',
            html: '.test_reports/html/html-report.html',
        }
    }
})