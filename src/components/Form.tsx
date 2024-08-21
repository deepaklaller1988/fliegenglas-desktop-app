import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderLink from "./HiArrowleft";

interface FormProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onSubmit: () => void;
  label?: string
  buttonText: string;
  type: "text" | "email" | "textarea";
  readOnly?: boolean;
  additionalContent?: React.ReactNode;
  isPending?:boolean
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
  isPending
}) => {
const router=useRouter()
  return (
    <div id="login-page" className="px-4 w-full">
      <div className="loginInner">
        <HeaderLink className="py-4 pr-4 text-white" onClick={()=>router.push("/home")}/>
        <div className="w-full">
          <div className="form-view max-w-[400px] m-auto">
            <div className="w-full">
              <h2 className="text-bold text-xl text-white block text-center mb-4">{title}</h2>
              <b className="text-bold text-[18px] text-white block text-center mb-12 pt-4"> {additionalContent}</b>
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
                  <b className="text-white mt-2 block">
                    {label}
                  </b>
                  <input
                    id="field"
                    className="my-3 bg-white text-black rounded-md p-3 h-[50px] w-full"
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                  />
                </>
              )}
              <button
                type="submit"
                className={`${isPending  ? 'flie-loader' : ''} p-2 w-full border button border-white rounded-md text-white`}
                onClick={onSubmit}
                disabled={isPending} 
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

