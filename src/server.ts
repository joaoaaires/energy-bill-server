import Fastify from 'fastify'
import cors from '@fastify/cors'
import autoload from '@fastify/autoload'
import multipart from '@fastify/multipart'
import fStatic from '@fastify/static'
import { resolve } from 'path'
import { readdir } from 'node:fs'
import { makeConvertBillUseCase } from './app/features/bill/usecases/factories/make-convert-bill-use-case'
import { makeSaveBillUseCase } from './app/features/bill/usecases/factories/make-save-bill-use-case'

const app = Fastify({
  logger: true,
})

app.register(multipart)
app.register(fStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})
app.register(cors, {
  origin: true,
})
app.register(autoload, {
  dir: resolve(__dirname, 'app/features'),
  ignorePattern: /^.*index\.ts.*$/,
  maxDepth: 1,
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    const dir = resolve(__dirname, '../uploads')
    readdir(dir, async (err, files) => {
      // handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }

      const filePaths = files.map((file) => resolve(dir, file))

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
          fileName: bill.fileName,
          items: bill.items,
        })
      }
    })
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
