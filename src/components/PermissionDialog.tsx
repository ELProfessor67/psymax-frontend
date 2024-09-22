import React from 'react'
import { LuSettings2 } from "react-icons/lu";


interface IProps {
    open:Boolean;
    onClose: () => void;
}

const PermissionDialog:React.FC<IProps> = ({onClose,open}) => {
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 ${open ? 'block' : 'hidden'}`}>

            <div className='max-w-[40rem] bg-white h-[90vh] md:h-[75vh] p-4 mx-auto md:mt-20'>
                {/* <div className='flex justify-end items-center'>
                    <button className='text-black' onClick={onClose}><RiCloseLargeLine /></button>
                </div> */}

                <div className=' flex-col md:flex-row gap-4 hidden md:flex'>
                    <img src='/permission.png' className='w-[20rem] mx-auto' />
                    <div className=''>
                        <h2 className='text-black/90 text-2xl mb-2 mt-5 select-none'>Meet hat keinen Zugriff auf Ihr Mikrofon</h2>
                        <ol className='text-black/80 flex flex-col gap-3 select-none'>
                            <li>1. Klicken Sie in der Adressleiste Ihres Browsers auf das Symbol für Seiteninformationen <span className='inline-block'><LuSettings2 /></span></li>
                            <li>2. Mikrofon aktivieren</li>
                        </ol>
                    </div>

                </div>
                <img src='/permission-phone.png' className='w-full mx-auto md:hidden' />

                <div className='flex items-center justify-center max-w-[30rem] mx-auto flex-col'>
                    <h2 className='text-[36px] font-bold text-black/90 text-center select-none'>Zugriff auf Mikrofon und Kamera erlauben</h2>
                    <p className='text-[#707070] text-[18px] font-medium mt-4 text-center select-none'>Bitte klicken Sie in der Adressleiste Ihres Browsers auf das angezeigte Symbol und aktivieren Sie Ihr Mikrofon und Ihre Kamera.</p>
                </div>
            </div>
        </div>
    )
}

export default PermissionDialog