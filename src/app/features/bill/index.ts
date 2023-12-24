import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateBillUseCase } from './usecases/factories/make-create-bill-use-case'
import { makeFindAllBillUseCase } from './usecases/factories/make-find-all-bill-use-case'
import { makeUploadBillUseCase } from './usecases/factories/make-upload-bill-use-case'

export default async (app: FastifyInstance) => {
  app.route({
    url: '',
    method: ['POST'],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        customerCode,
        customerName,
        customerAddress,
        installationCode,
        dueDate,
        total,
        accessKey,
        items,
      } = z
        .object({
          customerCode: z.string(),
          customerName: z.string(),
          customerAddress: z.string(),
          installationCode: z.string(),
          dueDate: z.string().transform((str) => new Date(str)),
          total: z.number().int(),
          accessKey: z.string(),
          items: z
            .object({
              description: z.string(),
              unit: z.string(),
              quantity: z.number().int(),
              price: z.number().int(),
            })
            .array(),
        })
        .parse(request.body)

      const createBillUseCase = makeCreateBillUseCase()
      const { bill } = await createBillUseCase.execute({
        customerCode,
        customerName,
        customerAddress,
        installationCode,
        dueDate,
        total,
        accessKey,
        items,
      })
      return reply.code(200).send(bill)
    },
  })

  app.route({
    url: '',
    method: ['GET'],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { page, perPage, query } = z
        .object({
          page: z
            .string()
            .transform((str) => parseInt(str))
            .optional(),
          perPage: z
            .string()
            .transform((str) => parseInt(str))
            .optional(),
          query: z.string().optional(),
        })
        .parse(request.query)

      const findAllBillUseCase = makeFindAllBillUseCase()
      const { bills } = await findAllBillUseCase.execute({
        page,
        perPage,
        query,
        showFaturaItem: true,
      })

      return reply.code(200).send(bills)
    },
  })

  app.route({
    url: '/upload',
    method: ['POST'],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const uploads = request.files()

      const uploadBillUseCase = makeUploadBillUseCase()
      const { filePaths } = await uploadBillUseCase.execute({ uploads })

      return reply.code(200).send(filePaths)
    },
  })
}
