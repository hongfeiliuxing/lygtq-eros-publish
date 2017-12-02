const responseSchema = require('../../responseSchema/appJsBundle')
module.exports = (fastify) => {
    fastify.route({
        method: 'DELETE',
        url: '/apps/:id',
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
            const data = await fastify.db.models.App.findById(request.params.id);
            await data.destroy()
            return data
        }
    })
}