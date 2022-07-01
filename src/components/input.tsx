import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = {
  label: string;
  unit: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, unit }: InputProps) => {
  return (
    <label className="mb-6 block">
      {label && (
        <span className="text-sm font-normal text-gray-400">{label}</span>
      )}
      <div className="flex items-baseline">
        <input
          type="text"
          className={clsx(
            "mt-1 mr-4 block w-24 border-0 border-b-2 border-gray-200 px-0.5 focus:border-black focus:ring-0"
          )}
        />
        <span>{unit}</span>
      </div>
    </label>
  );
};
