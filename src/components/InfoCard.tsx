import Image from 'next/image';

interface InfoCardProps {
  title: string;
  likes: number;
  audiobookDuration: string;
  copyright: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, likes, audiobookDuration, copyright }) => {
  return (
    <div className="w-full bg-white/80 rounded-md p-3 mt-3 flex flex-col gap-3">
      <div className="w-full flex items-center gap-1">
        <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">Titel:</b>
        <p className="text-[#232a2c] text-[16px]">{title}</p>
      </div>
      <div className="w-full flex items-center gap-1">
        <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">Bewertung:</b>
        <p className="text-[#232a2c] text-[16px] flex gap-1 items-center">
          <Image
            className="w-[20px]"
            src="../assets/images/icon-like-new-filled.svg"
            alt="favorite"
            width={20}
            height={20}
          />
          {likes} gefällt das.
        </p>
      </div>
      <div className="w-full flex items-center gap-1">
        <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">Dauer:</b>
        <p className="text-[#232a2c] text-[16px]">{audiobookDuration}</p>
      </div>
      <div className="w-full flex items-center gap-1">
        <b className="text-[#232a2c] text-[16px] min-w-[90px] max-w-[90px]">Copyright:</b>
        <p className="text-[#232a2c] text-[16px]">{copyright}</p>
      </div>
    </div>
  );
};

export default InfoCard;
