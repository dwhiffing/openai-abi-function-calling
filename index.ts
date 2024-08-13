import 'dotenv/config'
import { generateToolFromABI, getContractAbi } from './chain'
import { inspect } from 'util'
import { getOpenAIResponse } from './llm'

const logObject = (obj: any) => {
  console.log(inspect(obj, false, null, true))
}

const run = async (address: string) => {
  const ABI = await getContractAbi(address)

  const tools = ABI.filter((f) => f.name && f.type === 'function').map(
    generateToolFromABI,
  )
  const prompt =
    'I would like to transfer 123 from 0xbd3531da5cf5857e7cfaa92426877b022e612cf8 to 0xbd3531da5cf5857e7cfaa92426877b022e612cf9'
  // const prompt = 'I would like to know who created this contract'
  // const prompt = 'I would like to see a list of the possible actions I can take'
  const resp = await getOpenAIResponse(prompt, tools)

  logObject(resp.choices)
}

run('0xbd3531da5cf5857e7cfaa92426877b022e612cf8')
