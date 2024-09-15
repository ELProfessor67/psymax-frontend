import React from 'react'
import { IUserMessage } from './ChatSidebar'




const MessageBox:React.FC<IUserMessage> = ({message,name,isMe}) => {
  return (
    <div className='py-2 px-3 rounded-md bg-gray-100 my-3'>
        <h3 className='text-black/50'>{name} {isMe ? '(You)': ''}</h3>
        <p className='text-black/80'>{message}</p>
    </div>
  )
}

export default MessageBox