import { PrismaBillRepository } from '../../repositories/prisma-bill-repository'
import { CreateBillUseCase } from '../create-bill'

export function makeCreateBillUseCase() {
  const repository = new PrismaBillRepository()
  const useCase = new CreateBillUseCase(repository)
  return useCase
}
