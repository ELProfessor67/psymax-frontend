import useIsMobile from '@/hooks/useIsMobile';
import React, { FC, ReactNode } from 'react'



interface IProps 
{
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Sidebar:FC<IProps> = ({open,onClose,children}) => {
    const isModile = useIsMobile();
    return (
        <div
            className={!isModile ? `w-[22rem] border-l border-gray-200  z-50 h-[90vh] overflow-y-auto overflow-x-hidden transition-all duration-300- bg-white ${open ? 'translate-x-0 block' : 'translate-x-[100%] hidden'
                } py-4 px-4` : `absolute top-0 right-0 w-[22rem] z-50 h-[90vh] transition-all bg-white ${open ? 'translate-x-0 !block' : 'translate-x-[100%] !hidden'
                } py-4 px-4 overflow-y-auto order-l border-gray-200 `}
        >
            {children}
        </div>
    )
}

export default Sidebar