/* eslint-disable react-refresh/only-export-components */
import { message } from 'antd';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface MessageContextType {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
  info: (content: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const messageContext: MessageContextType = {
    success: (content: string) => messageApi.success(content),
    error: (content: string) => messageApi.error(content),
    warning: (content: string) => messageApi.warning(content),
    info: (content: string) => messageApi.info(content),
  };

  return (
    <MessageContext.Provider value={messageContext}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
}; 