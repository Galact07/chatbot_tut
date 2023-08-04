import { Message } from "@/libs/validations/message";
import { nanoid } from "nanoid";
import { createContext, useState } from "react";

const defaultValue = [
    {
      id: nanoid(),
      content: 'Hello, how can I help you?',
      isUser: false,
    },
  ]
  

export const MessageContext=  createContext<{
    messages:Message[],
    isLoading:boolean,
    setIsLoading:(value:boolean)=>void,
    addMessage:(message:Message)=>void,
    removeMessage:(id:string)=>void,
    updateMessage:(id:string,updateFunction:(prevText:string)=>string)=>void,
}>({
    messages:[],
    isLoading:false,
    setIsLoading:()=>{},
    addMessage:()=>{},
    removeMessage:()=>{},
    updateMessage:()=>{},
});

export const MessageProvider=({children}:{children:React.ReactNode})=>{
    const[messages,setMessages]=useState(defaultValue);
    const[isLoading,setIsLoading]=useState<boolean>(false);

    const addMessage=(message:Message)=>{
        setMessages((prevMessages)=>[...prevMessages,message])
    }

    const removeMessage=(id:string)=>{
        setMessages((prevMessages)=>prevMessages.filter((message)=>message.id!==id))
    }

    const updateMessage=(id:string,updateFunction:(prevText:string)=>string)=>{
        setMessages((prevMessages)=>prevMessages.map((message)=>{
            if(message.id===id){
                return{
                    ...message,
                    content:updateFunction(message.content)
                }
            }
            return message;
        }))
    }

    return(
        <MessageContext.Provider value={{messages,isLoading,setIsLoading,addMessage,removeMessage,updateMessage}}>
            {children}
        </MessageContext.Provider>
    )
}