import { Prisma } from '@prisma/client'
import { BillRepository } from './bill-repository'
import { prisma } from '../../../core/platform/prisma'

export class PrismaBillRepository implements BillRepository {
  async create(data: Prisma.BillCreateInput) {
    return await prisma.bill.create({
      data,
    })
  }

  async findAll({
    page,
    perPage,
    query,
    showFaturaItem,
  }: {
    page: number
    perPage: number
    query?: string | undefined
    showFaturaItem?: boolean | undefined
  }) {
    return await prisma.bill.findMany({
      skip: page * perPage,
      take: perPage,
      where: query
        ? {
            AND: {
              customerCode: query,
            },
          }
        : undefined,
      include: {
        items: showFaturaItem,
      },
      orderBy: {
        dueDate: 'desc',
      },
    })
  }
}
