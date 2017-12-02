const responseSchema = require('../../responseSchema/appJsBundle')
module.exports = (fastify) => {
    fastify.route({
        method: 'DELETE',
        url: '/apps/jsBundles/:id',
        schema: {
            params:{
                type:'object',
                properties:{
                    id:{
                        type:'integer'
                    }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: responseSchema
                    }
                }
            }
        },
        handler: async(request, reply) => {
            const data = await fastify.db.models.AppJsBundle.findById(request.params.id);
            await data.destroy()
            return data
        }
    })
}