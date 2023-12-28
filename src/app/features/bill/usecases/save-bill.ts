import { BillRepository } from '../repositories/bill-repository'
import { Bill } from '@prisma/client'

interface SaveBillUseCaseRequest {
  customerCode?: string
  customerName?: string
  customerAddress?: string
  installationCode?: string
  reference?: string
  dueDate?: Date
  total?: number
  accessKey?: string
  fileName?: string
  items?: {
    description?: string
    unit?: string
    quantity?: number
    total?: number
  }[]
}

interface SaveBillUseCaseResponse {
  bill: Bill
}

export class SaveBillUseCase {
  billRepository: BillRepository

  constructor(billRepository: BillRepository) {
    this.billRepository = billRepository
  }

  async execute({
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
  }: SaveBillUseCaseRequest): Promise<SaveBillUseCaseResponse> {
    const accessKeyNotNull = accessKey || ''
    let bill = await this.billRepository.findByAccessKey(accessKeyNotNull)
    if (!bill) {
      bill = await this.billRepository.create({
        customerCode: customerCode || '',
        customerName: customerName || '',
        customerAddress: customerAddress || '',
        installationCode: installationCode || '',
        reference: reference || '',
        dueDate: dueDate || new Date(),
        total: total || 0,
        accessKey: accessKey || '',
        fileName: fileName || '',
        items: {
          createMany: {
            data:
              items?.map((item) => {
                return {
                  description: item.description || '',
                  unit: item.unit || '',
                  quantity: item.quantity || 0,
                  total: item.total || 0,
                }
              }) || [],
          },
        },
      })
    } else {
      bill = await this.billRepository.update({
        data: {
          customerCode: customerCode || bill.customerCode,
          customerName: customerName || bill.customerName,
          customerAddress: customerAddress || bill.customerAddress,
          installationCode: installationCode || bill.installationCode,
          dueDate: dueDate || bill.dueDate,
          total: total || bill.total,
          accessKey: accessKey || bill.accessKey,
        },
        where: {
          id: bill.id,
        },
      })
    }
    return { bill }
  }
}
