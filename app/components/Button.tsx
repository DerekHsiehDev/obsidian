import React from 'react';

interface ButtonProps {
  text: string;
  classNames?: string;
  icon?: string; 
  iconClasses?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, classNames, icon, iconClasses, onClick }) => {
    return (
        <button
          type="button"
          onClick={onClick}
          className={`inline-flex items-center gap-x-2 px-3.5 py-2.5 rounded-xl ${classNames}  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-400 ease-in-out active:scale-95`}
        >
          {text}
          {icon && React.createElement(icon, { className: `-mr-0.5 h-5 w-5 ${iconClasses}`, "aria-hidden": "true" })}
        </button>
      );
}

export default Button;
