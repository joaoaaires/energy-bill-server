import { ConvertBillUseCase } from '../convert-bill'

export function makeConvertBillUseCase() {
  const useCase = new ConvertBillUseCase()
  return useCase
}
