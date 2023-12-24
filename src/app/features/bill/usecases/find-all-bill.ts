import { Bill } from '@prisma/client'
import { BillRepository } from '../repositories/bill-repository'

interface FindAllBillUseCaseRequest {
  page: number | undefined
  perPage: number | undefined
  query: string | undefined
  showFaturaItem: boolean
}

interface FindAllBillUseCaseResponse {
  bills: Bill[]
}

export class FindAllBillUseCase {
  billRepository: BillRepository

  constructor(billRepository: BillRepository) {
    this.billRepository = billRepository
  }

  async execute({
    page,
    perPage,
    query,
    showFaturaItem,
  }: FindAllBillUseCaseRequest): Promise<FindAllBillUseCaseResponse> {
    let pageNotNull = page || 0
    if (pageNotNull <= 0) pageNotNull = 1

    let perPageNotNull = perPage || 10
    if (perPageNotNull <= 0) perPageNotNull = 10

    const bills = await this.billRepository.findAll({
      page: pageNotNull - 1,
      perPage: perPageNotNull,
      query,
      showFaturaItem,
    })
    return { bills }
  }
}
