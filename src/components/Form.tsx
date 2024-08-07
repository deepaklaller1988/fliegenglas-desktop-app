import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

interface FormProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onSubmit: () => void;
  label?:string
  buttonText: string;
  type: "text" | "email" | "textarea";
  readOnly?: boolean;
  additionalContent?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  title,
  placeholder,
  value,
  onChange,
  onSubmit,
  buttonText,
  type,
  label,
  readOnly = false,
  additionalContent,
}) => {
  const router = useRouter();

  return (
    <div id="form-page" className="px-4 w-full mt-10 flex items-center justify-center">
      <div className="formInner bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="header mb-4">
          <a href="#" className="text-white flex items-center" onClick={() => router.back()}>
            <HiArrowLeft className="text-lg" />
          </a>
        </div>
        <div className="container">
          <div className="form">
            <h1 className="text-white text-2xl mb-4">{title}</h1>
            {additionalContent}
            {type === "textarea" ? (
              <>
                <textarea
                  id="field"
                  value={value}
                  className="bg-white text-black rounded-sm p-3 w-full h-24 resize-none mb-4"
                  placeholder={placeholder}
                  onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                ></textarea>
              </>
            ) : (
              <>
                <label htmlFor="field" className="text-white block mb-2">
                  {label}
                </label>
                <input
                  id="field"
                  className="bg-white text-black rounded-sm p-3 w-full mb-4"
                  placeholder={placeholder}
                  type={type}
                  value={value}
                  onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                  readOnly={readOnly}
                />
              </>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={onSubmit}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
