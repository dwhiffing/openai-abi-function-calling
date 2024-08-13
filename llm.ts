import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are to interact with a smart contract on behalf of the user.  The smart contract address is 0xbd3531da5cf5857e7cfaa92426877b022e612cf8.  You will be provided with functions that represent the functions in the abi the user can call.  Based on the users prompt, determine what function they are trying to call, and extract the appropriate inputs.`
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

export const getOpenAIResponse = async (
  message: string,
  tools: OpenAI.ChatCompletionTool[],
) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      tools,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    })

    return response
  } catch (error) {
    console.error('Error fetching OpenAI API:', error)
    throw error
  }
}
