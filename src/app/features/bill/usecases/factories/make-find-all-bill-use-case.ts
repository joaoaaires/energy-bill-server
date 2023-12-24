import { PrismaBillRepository } from '../../repositories/prisma-bill-repository'
import { FindAllBillUseCase } from '../find-all-bill'

export function makeFindAllBillUseCase() {
  const repository = new PrismaBillRepository()
  const useCase = new FindAllBillUseCase(repository)
  return useCase
}
