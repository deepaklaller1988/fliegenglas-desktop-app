import Image from 'next/image';
import Link from 'next/link';

const AudioDetailCard = ({ imageSrc, title, name, linkHref }:any) => {
  return (
    <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex gap-3">
      <span className="min-w-[85px] max-w-[85px]">
        <Image
          className="block w-full rounded-lg"
          src={imageSrc}
          alt={title}
          width={85}
          height={85}
        />
      </span>
      <span className="relative w-full">
        <b className="text-[#232a2c] text-[16px]">{title}:</b>
        <p className="text-[#232a2c] text-[16px] opacity-60 leading-none">
          {name}
        </p>
        <Link
          className="absolute bottom-0 right-0 bg-[#6c7279] text-white w-[128px] p-[5px] px-2 rounded-md text-sm text-center"
          href={linkHref}
        >
          Alle Hörbücher
        </Link>
      </span>
    </div>
  );
};

export default AudioDetailCard;
