import OpenAI from 'openai'
import type { AbiFunction } from 'abitype'

export const getContractAbi = async (address: string) => {
  const resp = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${TOKEN}`,
  )
  const body = (await resp.json()) as { message: string; result: string }
  if (body?.message === 'OK') {
    return JSON.parse(body.result) as AbiFunction[]
  }

  return []
}

const TOKEN = process.env.ETHERSCAN_TOKEN

// TODO: also need to handle tuples/arrays
export const generateToolFromABI = (
  func: AbiFunction,
): OpenAI.ChatCompletionTool => {
  let properties: Record<string, { type: string; description: string }> = {}

  func.inputs.forEach((input) => {
    let _type = 'string'
    if (input.type === 'bool') _type = 'boolean'
    if (input.type.match(/int|fixed/)) _type = 'number'
    properties[input.name ?? ''] = { type: _type, description: 'description' }
  })
  let parameters =
    func.inputs.length === 0
      ? undefined
      : {
          type: 'object',
          properties,
          additionalProperties: false,
          required: Object.keys(properties),
        }

  return {
    type: 'function',
    function: {
      name: func.name,
      description: `Description for ${func.name}`,
      parameters,
    },
  }
}
