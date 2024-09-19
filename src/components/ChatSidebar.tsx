import React, { useCallback, useState } from 'react'
import { RiCloseLargeLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import ScrollToBottom from 'react-scroll-to-bottom';
import useChatSocket from '@/hooks/useChatSocket';
import MessageBox from './MessageBox';
import useIsMobile from '@/hooks/useIsMobile';

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
    datetime?: Date
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
        <div
            className={!isModile ? `w-[25rem] shadow-xl z-50 h-[90vh] bg-white transition-all ${open ? 'block' : 'hidden'
                } py-4 px-4` : `absolute top-0 right-0 w-[25rem] shadow-xl z-50 h-[90vh] bg-white transition-all ${open ? 'translate-x-0' : 'translate-x-[100%]'
                } py-4 px-4`}
        >
            <h2 className='text-[28px] font-bold text-[#3C3C3C]'>Chat</h2>
            <div className='relative h-[93%] max-w-[25rem]'>
                <ScrollToBottom className='h-[90%] overflow-y-auto'>
                    {
                        messages && messages.map(data => <MessageBox {...data}/>)
                    }
                    
                </ScrollToBottom>
                <form className='h-[10%] flex items-center py-2 gap-3' onSubmit={handleSend}>
                    <input type='text' className='w-[90%] py-3 px-3 bg-gray-100 rounded-md border-none outline-none' placeholder='Write Something...' value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button className='w-10 h-10 rounded-full grid place-items-center text-white bg-green-600' type='submit'><IoMdSend/></button>
                </form>

            </div>
        </div>
    )
}

export default ChatSidebar