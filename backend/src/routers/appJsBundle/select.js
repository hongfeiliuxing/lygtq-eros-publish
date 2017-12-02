const responseSchema = require('../../responseSchema/appJsBundle')
module.exports = (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/apps/:id/jsBundles',
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
            const data = await fastify.db.models.AppJsBundle.findAll({
                where:{
                    AppId:request.params.id
                },
                order:[['createdAt','DESC']]
            })
            return data
        }
    })
}