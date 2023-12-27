import { readFileSync } from 'node:fs'
import PdfParse = require('pdf-parse')

interface BillItem {
  description?: string
  unit?: string
  quantity?: number
  total?: number
}

interface Bill {
  customerCode?: string
  customerName?: string
  customerAddress?: string
  installationCode?: string
  reference?: string
  dueDate?: Date
  total?: number
  accessKey?: string
  items?: BillItem[]
}

interface ConvertBillUseCaseRequest {
  filePaths: string[]
}

interface ConvertBillUseCaseResponse {
  bills: Bill[]
}

export class ConvertBillUseCase {
  async execute({
    filePaths,
  }: ConvertBillUseCaseRequest): Promise<ConvertBillUseCaseResponse> {
    const bills = []

    for (const filePath of filePaths) {
      const dataBuffer = readFileSync(filePath)
      const data = await PdfParse(dataBuffer)

      const lines = data.text
        .split('\n')
        .map((line) => line.trim().replace(/\s+/g, ' '))
        .filter((line) => line.length > 0)

      if (lines.length <= 0) break

      const bill: Bill = {}
      const items: BillItem[] = []

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index]
        const lineLocaleLowerCase = line.toLocaleLowerCase()

        // SE LINHA TEM A PALAVRA ENERGIA E KWH
        // VAI PARA VERIFICACAO DE ITENS
        let match =
          lineLocaleLowerCase.includes('energia') &&
          lineLocaleLowerCase.includes('kwh')
        if (match) {
          const billItem = this._getBillItem(line)
          if (billItem) items.push(billItem)
        }

        // ITEM DE ILUM PUBLICA
        match = lineLocaleLowerCase.includes('contrib ilum publica municipal')
        if (match) {
          const billItem = this._getBillItemPublicEnergy(line)
          if (billItem) items.push(billItem)
        }

        // TOTAL DA FATURA
        match = lineLocaleLowerCase.includes('total')
        if (match) {
          const total = this._getTotal(line)
          if (total) bill.total = total
        }

        // NOME E ENDERECO
        match =
          (lineLocaleLowerCase.includes('cpf') ||
            lineLocaleLowerCase.includes('cnpj')) &&
          !lineLocaleLowerCase.includes('cemig')
        if (match) {
          bill.customerName = lines[index - 4]
          bill.customerAddress =
            lines[index - 3] +
            ' - ' +
            lines[index - 2] +
            ' - ' +
            lines[index - 1]
        }

        // NUMERO DO CLIENTE E INSTALACAO
        match =
          lineLocaleLowerCase.includes('cliente') &&
          lineLocaleLowerCase.includes('instalação')
        if (match) {
          const response = this._getCustomerAndInstallationCode(
            lines[index + 1],
          )
          if (response) {
            bill.customerCode = response.customerCode
            bill.installationCode = response.installationCode
          }
        }

        // DATA DE VENCIMENTO
        match = lineLocaleLowerCase.includes('vencimento')
        if (match) {
          console.log(lines[index + 1])
          const response = this._getReferenceAndDueDate(lines[index + 1])
          if (response) bill.reference = response.reference
          if (response) bill.dueDate = response.due
        }

        // CHAVE DE ACESSO
        match = lineLocaleLowerCase.includes('chave de acesso')
        if (match) {
          bill.accessKey = lines[index + 1]
        }
      }

      bill.items = items
      bills.push(bill)
    }

    return { bills }
  }

  _getBillItem(line: string): BillItem | null {
    const unit = 'kWh'
    const values = line.split(unit)

    if (values.length <= 1) return null

    const description = values[0].trim()
    const attributes = values[1].trim().split(' ')

    if (attributes.length <= 3) return null

    const quantity = parseInt(attributes[0].replace('.', ''))
    const total = parseFloat(attributes[2].replace(',', '.'))

    return {
      description,
      unit,
      quantity,
      total: Math.round(total * 100),
    }
  }

  _getBillItemPublicEnergy(line: string): BillItem | null {
    const regex = /\b(\d+(?:,\d{1,2})?)\b/
    const match = line.match(regex)

    if (!match) return null

    const description = line.replace(match[1], '').trim()
    const unit = 'Unid'
    const quantity = 1
    const total = parseFloat(match[1].replace(',', '.'))

    return {
      description,
      unit,
      quantity,
      total: Math.round(total * 100),
    }
  }

  _getTotal(line: string): number | null {
    const regex = /\b(\d+(?:,\d{1,2})?)\b/
    const match = line.match(regex)

    if (!match) return null

    const total = parseFloat(match[1].replace(',', '.'))
    return Math.round(total * 100)
  }

  _getCustomerAndInstallationCode(
    line: string,
  ): { customerCode: string; installationCode: string } | null {
    const values = line.split(' ')

    if (values.length <= 1) return null

    return { customerCode: values[0], installationCode: values[1] }
  }

  _getReferenceAndDueDate(
    line: string,
  ): { reference: string; due: Date } | null {
    const values = line.split(' ')

    if (values.length <= 1) return null

    const regexDataBrasileira = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = values[1].match(regexDataBrasileira)

    if (!match) return null

    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)

    const data = new Date(year, month - 1, day)
    return { reference: values[0], due: data }
  }
}
