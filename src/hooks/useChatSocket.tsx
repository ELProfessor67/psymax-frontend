import { io, Socket } from "socket.io-client";
import { ChatClientToServerEvents,ChatServerToClientEvents } from '@/types/chatSocket';
import { useCallback, useEffect, useRef, useState } from "react";
import { JOIN_ROOM, MESSAGE } from "@/constant/chatEvents";
import { IUserMessage } from "@/components/ChatSidebar";

const useChatSocket = (name:string,room_id:string,setMessages:React.Dispatch<React.SetStateAction<IUserMessage[]>>) => {
  const chatSocketIdRef = useRef<string | null>(null)
  const chatSocketRef = useRef<null | Socket<ChatServerToClientEvents, ChatClientToServerEvents>>(null);

  function initSocket() {
    if (chatSocketRef.current == null) {
        chatSocketRef.current = io(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}`);
        chatSocketRef.current.emit(JOIN_ROOM,{room_id,name},(id) => {
          chatSocketIdRef.current = id;
        })
    }
  }

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    chatSocketRef.current?.on(MESSAGE,({message,name,socketId}) => {
      console.log('message')
      const newMessage:IUserMessage = {
        isMe: socketId == chatSocketIdRef.current,
        name,
        socketId,
        message,
        datetime: new Date(Date.now())
      }

      setMessages(prev => [...prev,newMessage]);
    })

    return () => {
      chatSocketRef.current?.off(MESSAGE);
    }
  },[chatSocketRef.current])

  const handleMessageSend = useCallback((text:string) => {
    chatSocketRef.current?.emit(MESSAGE,{room_id,text,name});
  },[chatSocketRef.current]);

  return {handleMessageSend}
  }

export default useChatSocket