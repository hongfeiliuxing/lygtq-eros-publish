const responseSchema = require('../../responseSchema/app')
module.exports = (fastify) => {
    fastify.route({
        method: 'POST',
        url: '/apps',
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'APP名称'
                    },
                    appName: {
                        type: 'string',
                        description: 'eros中的appName'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: responseSchema
                }
            }
        },
        handler: async(request, reply) => {

            const app = await fastify.db.models.App.create({
                name: request.body.name,
                appName: request.body.appName
            })
            return app
        }
    })
}