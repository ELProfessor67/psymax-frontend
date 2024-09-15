import React from 'react'
import { LuSettings2 } from "react-icons/lu";
import { RiCloseLargeLine } from "react-icons/ri";


interface IProps {
    open:Boolean;
    onClose: () => void;
}

const PermissionDialog:React.FC<IProps> = ({onClose,open}) => {
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 p-4 ${open ? 'block' : 'hidden'}`}>

            <div className='max-w-[40rem] bg-white shadow-xl rounded-md p-4 mx-auto mt-28'>
                <div className='flex justify-end items-center'>
                    <button className='text-black' onClick={onClose}><RiCloseLargeLine /></button>
                </div>

                <div className='flex flex-col md:flex-row gap-4'>
                    <img src='/permission.png' className='w-[20rem] mx-auto' />
                    <div>
                        <h2 className='text-black/90 text-2xl mb-2 mt-5'>Meet hat keinen Zugriff auf Ihr Mikrofon</h2>
                        <ol className='text-black/80 flex flex-col gap-3'>
                            <li>1. Klicken Sie in der Adressleiste Ihres Browsers auf das Symbol für Seiteninformationen <span className='inline-block'><LuSettings2 /></span></li>
                            <li>2. Mikrofon aktivieren</li>
                        </ol>
                    </div>

                </div>

                <div className='flex items-center justify-center max-w-[18rem] mx-auto flex-col'>
                    <h2 className='text-2xl font-bold text-black/90 text-center'>Zugriff auf Mikrofon und Kamera erlauben</h2>
                    <p className='text-black/80 leading-6 mt-4 text-center'>Bitte klicken Sie in der Adressleiste Ihres Browsers auf das angezeigte Symbol und aktivieren Sie Ihr Mikrofon und Ihre Kamera.</p>
                </div>
            </div>
        </div>
    )
}

export default PermissionDialog