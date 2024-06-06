export default defineEventHandler( async (event) => {
    try {
        const body = readBody(event)
        const projectid = getRouterParam(event,'projectid')
        const response = await fetch(`http://nginx/api/project/${projectid}`, {
            method: 'PUT',
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
