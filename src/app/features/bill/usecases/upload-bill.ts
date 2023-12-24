import { MultipartFile } from '@fastify/multipart'
import { resolve } from 'node:path'
import { createWriteStream } from 'node:fs'

interface UploadBillUseCaseRequest {
  uploads: AsyncIterableIterator<MultipartFile>
}

interface UploadBillUseCaseResponse {
  filePaths: string[]
}

export class UploadBillUseCase {
  async execute({
    uploads,
  }: UploadBillUseCaseRequest): Promise<UploadBillUseCaseResponse> {
    // if (!uploads) return reply.code(400).send({ sucess: false })
    const filePaths = []
    for await (const upload of uploads) {
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'uploads',
        upload.filename,
      )
      const writeStream = createWriteStream(path)
      upload.file.pipe(writeStream)
      filePaths.push(path)
    }
    return { filePaths }
  }
}
