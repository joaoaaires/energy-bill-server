import { PrismaBillRepository } from '../../repositories/prisma-bill-repository'
import { SaveBillUseCase } from '../save-bill'

export function makeSaveBillUseCase() {
  const repository = new PrismaBillRepository()
  const useCase = new SaveBillUseCase(repository)
  return useCase
}
