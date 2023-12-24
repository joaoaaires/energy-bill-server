import { UploadBillUseCase } from '../upload-bill'

export function makeUploadBillUseCase() {
  const useCase = new UploadBillUseCase()
  return useCase
}
