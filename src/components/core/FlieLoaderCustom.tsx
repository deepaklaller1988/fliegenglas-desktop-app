import React from "react";
interface LoaderAttributes {
  height?: number;
}
const FlieLoaderCustom: React.FC<LoaderAttributes> = ({ height }) => {
  return (
    <div className="flex items-center justify-center">
      <img
        src="\loader-animated-gif.gif"
        alt="flie loader"
        className={`${height ? "h-44" : ""}`}
      />
    </div>
  );
};

export default FlieLoaderCustom;
