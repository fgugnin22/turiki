import React, { HTMLAttributes, MouseEventHandler } from 'react'
import './shadow.css'
const ButtonSecondary = (props: HTMLAttributes<HTMLButtonElement> & { text: string; onClick: MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button
            {...props}
            onClick={props.onClick}
            className='neonshadow p-5 transition duration-700 rounded-[10px] border-2 border-darkturquoise shadow-turquoise bg-gradient-to-b from-transparent to-turquoise to-[300%] hover:to-[200%] focus:bg-none active:bg-none'
        >
            {props.text}
        </button>
    )
}

export default ButtonSecondary