import React, { ButtonHTMLAttributes, MouseEventHandler } from "react";
import "./everything.css";
const ButtonMain = (
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode | React.ReactNode[] | string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }
) => {
  return (
    <button
      onClick={props.onClick}
      {...props}
      className={
        "neonshadow p-5 after:transition after:duration-500 ease-linear transition duration-500 hover:bg-lightblue " +
        "relative hover:after:opacity-0 after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 bg-transparent after:rounded-[10px] after:-z-10 " +
        "z-10 after:bg-gradient-to-r after:from-turquoise after:to-lightblue focus:p-[18px] focus:after:opacity-0 " +
        "focus:bg-transparent focus:border-2 focus:border-lightblue focus:outline-none active:outline-none active:after:opacity-0 " +
        "active:bg-transparent active:border-2 active:border-lightblue rounded-[10px] text-lightgray " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};

export default ButtonMain;
