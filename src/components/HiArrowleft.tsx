import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';

interface HeaderLinkProps {
    onClick?: () => void;
    className: string;
    title?: string;
    titleContent?:string
    label?:string
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ onClick, className,label, title,titleContent }) => {
    return (
        <div className="header">
            <div onClick={onClick}>
                <div className={className}>
                    <HiArrowLeft className="text-lg" />
                    {title &&
                        <div className="flex-grow text-center">
                            <h4 className="flex gap-1 pt-0 pb-4 text-white justify-center mt-6">
                                {title}
                            </h4>
                        </div>
                    }
                    {titleContent && 
                                <span className="text-white">:{label} {titleContent}</span>
                            }
                </div>
            </div>
        </div>
    );
};

export default HeaderLink;


