import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateBillUseCase } from './usecases/factories/make-create-bill-use-case'
import { makeFindAllBillUseCase } from './usecases/factories/make-find-all-bill-use-case'
import { makeUploadBillUseCase } from './usecases/factories/make-upload-bill-use-case'
import { makeConvertBillUseCase } from './usecases/factories/make-convert-bill-use-case'
import { makeSaveBillUseCase } from './usecases/factories/make-save-bill-use-case'

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
        reference,
        dueDate,
        total,
        accessKey,
        fileName,
        items,
      } = z
        .object({
          customerCode: z.string(),
          customerName: z.string(),
          customerAddress: z.string(),
          installationCode: z.string(),
          reference: z.string(),
          dueDate: z.string().transform((str) => new Date(str)),
          total: z.number().int(),
          accessKey: z.string(),
          fileName: z.string(),
          items: z
            .object({
              description: z.string(),
              unit: z.string(),
              quantity: z.number().int(),
              total: z.number().int(),
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
        reference,
        dueDate,
        total,
        accessKey,
        fileName,
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

      const convertBillUseCase = makeConvertBillUseCase()
      const { bills } = await convertBillUseCase.execute({ filePaths })

      const saveBillUseCase = makeSaveBillUseCase()
      for await (const bill of bills) {
        await saveBillUseCase.execute({
          customerCode: bill.customerCode,
          customerName: bill.customerName,
          customerAddress: bill.customerAddress,
          installationCode: bill.installationCode,
          reference: bill.reference,
          dueDate: bill.dueDate,
          total: bill.total,
          accessKey: bill.accessKey,
          items: bill.items,
        })
      }

      return reply.code(200).send(bills)
    },
  })
}
