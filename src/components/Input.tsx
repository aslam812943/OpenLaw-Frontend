import React from "react";

interface InputProps {
  label?: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  
  
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false, 
}) => (
  <div className="mb-4 w-full">
    {label && (
      <label htmlFor={name} className="block mb-1 font-medium">
        {label}
      </label>
    )}
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required} 
      className="w-full border border-gray-300 rounded p-2"
    />
  </div>
);

export default Input;