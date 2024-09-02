import React from "react";
import Link from "next/link";

interface RefreshButtonProps {
  onClick: () => void;
  text: string;
  className:string;
  linkClassName:string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, text ,className,linkClassName}) => {
  return (
    <div className={className} onClick={onClick}>
      <Link
        href="#top"
        className={linkClassName}
        prefetch={true}

      >
        {text}
      </Link>
    </div>
  );
};

export default RefreshButton;
