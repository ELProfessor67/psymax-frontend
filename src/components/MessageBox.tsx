import React from 'react'
import { IUserMessage } from './ChatSidebar'


function getTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
const MessageBox:React.FC<IUserMessage> = ({message,name,isMe,datetime}) => {
  return (
    <div className='py-2 rounded-md  my-3'>
      <div className={`flex items-center gap-2 ${isMe ? 'justify-end': 'justify-start'}`}>

        <h3 className='text-gray-700 text-[16px] font-semibold'>{name}</h3>
        <span className='text-blue-500 text-[12px] mt-1 font-semibold'>{datetime && getTime(datetime)}</span>
      </div>
        <p className={`text-[#707070] text-[16px] font-normal text-left mt-2`}>{message}</p>
    </div>
  )
}

export default MessageBox