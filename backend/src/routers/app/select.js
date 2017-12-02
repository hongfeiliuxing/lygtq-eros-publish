const responseSchema = require('../../responseSchema/app')
module.exports = (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/apps',
        schema: {
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
            const data = await fastify.db.models.App.findAll({
                include: [
                    fastify.db.models.AppJsBundle
                ]
            })
            return data
        }
    })
}