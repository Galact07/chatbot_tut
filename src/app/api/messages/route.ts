import { chatbotPrompt } from '@/constants/chatbotPrompt';
import { OpenAIStream } from '@/helpers/openai_stream';
import { ChatGPTMessage } from '@/interfaces/ChatGPTMessage';
import { OpenAIStreamPayload } from '@/interfaces/ChatGPTPayload';
import  { messageArrayValidator } from '@/libs/validations/message';
import {NextRequest,NextResponse} from 'next/server';
export async function POST(request:Request){
    try{
        const body=await request.json();
        const {messages}=body;

        const validMessage= messageArrayValidator.parse(messages);

        const outboundMessages: ChatGPTMessage[] = validMessage.map((message)=>{
            return {
                role: message.isUser?"user":"system",
                content: message.content
            }
        })

        outboundMessages.unshift({
            role:"system",
            content:chatbotPrompt
        })

        const payload: OpenAIStreamPayload = {
            model: 'gpt-3.5-turbo',
            messages: outboundMessages,
            temperature: 0.4,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 150,
            stream: true,
            n: 1,
          }
        
          const stream = await OpenAIStream(payload)
          return new Response(stream);
    }catch(error:any){

    }
}