import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default async (app: FastifyInstance) => {
  app.route({
    url: '/',
    method: ['GET'],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({ success: true })
    },
  })
}
