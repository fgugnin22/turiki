import React, { ButtonHTMLAttributes, MouseEventHandler } from "react";
import "./everything.css";
const ButtonSecondary = (
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode | React.ReactNode[] | string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }
) => {
  return (
    <button
      {...props}
      onClick={props.onClick}
      className={
        " relative after:absolute before:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 before:inset-[1px] rounded-[10px] " +
        " after:rounded-[10px] before:rounded-[9px] after:z-[-1] before:z-10 " +
        " after:bg-gradient-to-b after:from-turquoise after:to-lightblue " +
        " before:bg-gradient-to-b before:from-dark before:to-turquoise before:from-[-70%] before:to-[1200%] bg-transparent text-lightgray hover:bg-turquoise hover:bg-none " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};

export default ButtonSecondary;
