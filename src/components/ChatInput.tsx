"use client"

import { cn } from '@/libs/utils'
import { useMutation } from '@tanstack/react-query'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import axios from 'axios'
import {nanoid} from 'nanoid'
import messageValidator,{Message} from '@/libs/validations/message'
import { createContext } from 'vm'
import { MessageContext } from '@/context/MessageContext'
import { CornerDownLeft, Loader2 } from 'lucide-react'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement>{}



const ChatInput: FC<ChatInputProps> = ({className,...props}) => {
  const {messages,addMessage,removeMessage,setIsLoading,updateMessage}= useContext(MessageContext);
    const[inputMessage, setInputMessage]=useState('')
    const textAreaRef =useRef<HTMLTextAreaElement>(null);
    const {mutate:sendMessage,isLoading,isError}= useMutation({
        mutationFn: async (message:Message) => {{ 
          const response=  await fetch('/api/messages',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
          body:JSON.stringify({messages:[message]}) 
          })
          return response.body;
        }
        
    },
    onMutate(message){
           addMessage(message)
    },
    onSuccess:async(stream)=>{
       if(!stream){
        throw new Error('Stream is not defined')
       }
       const  id=nanoid();
       const responseMsg:Message={
           id,
            content:'',
            isUser:false
       }
       addMessage(responseMsg)
       setIsLoading(true);
       const streamReader= stream.getReader();
       const decoder= new TextDecoder();
       let done=false;

       while(!done){
            const {value,done:doneReading}= await streamReader.read();
            done=doneReading;
            const chunkValue=decoder.decode(value);
            updateMessage(responseMsg.id,(prevText:string)=>prevText+chunkValue)
       }

       setIsLoading(false);
       setInputMessage("");
       setTimeout(()=>{
        textAreaRef.current?.focus();
        }
        ,10)
    },
    onError(_,message){
      removeMessage(message.id);
      textAreaRef.current?.focus();
    }
})

  return (
  <div className={cn('border-t border-zinc-300',className)}>
    <div className='relative mt-4 overflow-hidden rounded-lg outline-none'>
    <TextareaAutoSize
    ref={textAreaRef}
    rows={2}
    maxRows={4}
    disabled={isLoading}
    className='disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
    placeholder="What Do you Wanna Talk about?"
    onChange={(e)=>{setInputMessage(e.target.value)}}
    onKeyDown={(e=>{
        if(e.key==='Enter' && !e.shiftKey){
            e.preventDefault()

            const message={
                id:nanoid(),
                content:inputMessage,
                isUser:true
            } as Message
            setInputMessage("");      
            sendMessage(message);
            
        }
        
    })}
    />

<div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
          <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400'>
            {isLoading ? (
              <Loader2 className='w-3 h-3 animate-spin' />
            ) : (
              <CornerDownLeft className='w-3 h-3' />
            )}
          </kbd>
        </div>

        <div
          className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
          aria-hidden='true'
        />
    </div>
  </div>
  )
}

export default ChatInput