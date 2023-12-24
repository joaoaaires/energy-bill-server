import { Prisma, Bill } from '@prisma/client'

export interface BillRepository {
  create(data: Prisma.BillCreateInput): Promise<Bill>
  findAll(params: {
    page: number
    perPage: number
    query?: string
    showFaturaItem?: boolean
  }): Promise<Bill[]>
}
