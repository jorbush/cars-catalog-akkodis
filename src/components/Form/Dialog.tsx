import React from 'react';
import 'tailwindcss/tailwind.css';
import { IoMdClose } from "react-icons/io";

interface DialogProps {
    content?: React.ReactElement;
    onToggleForm: () => void;
}

const Dialog: React.FC<DialogProps> = ({ 
    content,
    onToggleForm, 
}) => {
    return (
        <div className="
            justify-center 
            items-center 
            flex 
            overflow-x-hidden 
            overflow-y-auto 
            fixed 
            inset-0 
            z-50 
            outline-none 
            focus:outline-none
            backdrop-blur
        ">
        <div className="
            relative 
            w-full
            sm:w-5/6
            md:w-4/6
            lg:w-3/6
            xl:w-2/5
            my-6
            mx-auto 
            h-auto 
            bg-white
            shadow-lg
            border-[1px]
            rounded-xl
            p-6
          "
        >
            <div className='
                flex
                flex-row
                justify-end
            '>
                <IoMdClose size={18} className='cursor-pointer' onClick={onToggleForm}/>
            </div>
            <div className="relative flex-auto">
                {content}
            </div>
        </div>
        </div>

    );
  };
  
  export default Dialog;
  