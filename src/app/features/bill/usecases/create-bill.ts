import { BillRepository } from '../repositories/bill-repository'
import { Bill } from '@prisma/client'

interface CreateBillUseCaseRequest {
  customerCode: string
  customerName: string
  customerAddress: string
  installationCode: string
  dueDate: Date
  total: number
  accessKey: string
  items: {
    description: string
    unit: string
    quantity: number
    total: number
  }[]
}

interface CreateBillUseCaseResponse {
  bill: Bill
}

export class CreateBillUseCase {
  billRepository: BillRepository

  constructor(billRepository: BillRepository) {
    this.billRepository = billRepository
  }

  async execute({
    customerCode,
    customerName,
    customerAddress,
    installationCode,
    dueDate,
    total,
    accessKey,
    items,
  }: CreateBillUseCaseRequest): Promise<CreateBillUseCaseResponse> {
    const bill = await this.billRepository.create({
      customerCode,
      customerName,
      customerAddress,
      installationCode,
      dueDate,
      total,
      accessKey,
      items: {
        createMany: {
          data: items,
        },
      },
    })
    return { bill }
  }
}
