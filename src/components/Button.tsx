import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, type = 'button', disabled }) => (
  <button
    type={type}
    disabled={disabled}
    className={`w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50`}
  >
    {children}
  </button>
);

export default Button;
