import React, { MouseEventHandler } from 'react'
import './ButtonMain.css'
const ButtonMain = (props: { text: string; onClick: MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button
            {...props}
            onClick={props.onClick}
            className='mainbutton p-5 after:transition after:duration-500 ease-linear transition duration-500 hover:bg-lightblue 
            relative hover:after:opacity-0 after:absolute after:inset-0 bg-transparent after:rounded-[10px] after:-z-10 
            z-10 after:bg-gradient-to-r after:from-turquoise after:to-lightblue focus:p-[18px] focus:after:opacity-0 
            focus:bg-transparent focus:border-2 focus:border-lightblue focus:outline-none active:outline-none active:after:opacity-0 
            active:bg-transparent active:border-2 active:border-lightblue rounded-[10px] text-lightgray'
        >
            {props.text}
        </button>
    )
}

export default ButtonMain