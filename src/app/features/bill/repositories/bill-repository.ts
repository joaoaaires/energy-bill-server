import { Prisma, Bill } from '@prisma/client'

export interface BillRepository {
  create(data: Prisma.BillCreateInput): Promise<Bill>
  findAll(params: {
    page: number
    perPage: number
    query?: string
    showFaturaItem?: boolean
  }): Promise<Bill[]>
  findByAccessKey(accessKey: string): Promise<Bill | null>
  update(params: {
    data: Prisma.BillUpdateInput
    where: Prisma.BillWhereUniqueInput
  }): Promise<Bill>
}
