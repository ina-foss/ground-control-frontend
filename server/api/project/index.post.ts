export default defineEventHandler(async (event: any) => {
    try {
        const body = await readBody(event)
        const response = await fetch("http://nginx/api/project/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        return { response }
    } catch (err: any) {
        // Error handling
        return { error: err.message }
    }
})
