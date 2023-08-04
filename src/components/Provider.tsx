'use client'
import { FC, ReactNode } from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { MessageProvider } from '@/context/MessageContext'

interface ProviderProps {
  children:ReactNode
}

const Provider: FC<ProviderProps> = ({children}) => {

    const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MessageProvider>
        {children}
      </MessageProvider>

    </QueryClientProvider>
  )
}

export default Provider