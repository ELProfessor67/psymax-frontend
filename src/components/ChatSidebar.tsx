import React, { useCallback, useState } from 'react'

import ScrollToBottom from 'react-scroll-to-bottom';
import useChatSocket from '@/hooks/useChatSocket';
import MessageBox from './MessageBox';
import useIsMobile from '@/hooks/useIsMobile';
import { PiPaperPlaneTilt } from "react-icons/pi";

interface IProps {
    open: Boolean;
    onClose: () => void;
    name: string;
    room_id: string;
}

export interface IUserMessage {
    name: string;
    socketId: string;
    message: string;
    isMe: Boolean;
    datetime?: Date;
}

const ChatSidebar: React.FC<IProps> = ({ open, onClose,name,room_id }) => {
    const [messages,setMessages] = useState<IUserMessage[]>([]);
    const [message,setMessage] = useState('');
    const {handleMessageSend} = useChatSocket(name,room_id,setMessages);
    const isModile = useIsMobile();


    const handleSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!message) return
        handleMessageSend(message);
        setMessage('')
    },[message])
    return (
        <>
            <h2 className='text-[28px] font-bold text-gray-700'>Chat</h2>
            <div className='relative h-[91%] max-w-[25rem]'>
                <ScrollToBottom className='h-[94%] xl:h-[95%] overflow-y-auto'>
                    {
                        messages && messages.map(data => <MessageBox {...data}/>)
                    }
                    
                </ScrollToBottom>
                <form className='h-[10%] flex items-end relative -bottom-[10px]' onSubmit={handleSend}>
                    <div className='bg-gray-200 rounded-md flex items-center py-0 gap-3 w-full'>

                    <input type='text' className='w-[90%] py-3 px-3 bg-gray-200 rounded-md placeholder:text-[14px] placeholder:font-medium border-none outline-none text-black placeholder:text-black text-[14px] font-medium' placeholder='Nachricht absenden' value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button className='w-10 h-10 rounded-full grid place-items-center text-blue-500 text-2xl' type='submit'><PiPaperPlaneTilt/></button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default ChatSidebar