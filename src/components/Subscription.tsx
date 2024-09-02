import Image from "next/image";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";

const Subscription = ({ data }: any) => {
  return (
    <div className="rightSideSet">
      <div className="loaderSet w-full h-full items-center justify-center hidden">
        <Image
          className="block w-full max-w-[150px]"
          width={265}
          height={300}
          src={""}
          alt="Album"
          loading="lazy"
          />
      </div>
      <div
        className="w-full h-full overflow-auto bgChangeAlbum bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "/" + data.local_image }}
      >
        <div className="w-full p-3 relative z-10"></div>
        <Link
          href="../home"
          className="flex items-center gap-1 py-2 pb-3 mb-2 text-white"
          prefetch={true}
        >
          <MdKeyboardBackspace className="w-6 h-6" /> Zurück
        </Link>
        <div className="w-full">
          <Image
            className="block w-full shadow-xl"
            src={
              data?.local_image.includes("assets")
                ? "/" + data?.local_image
                : data?.local_image
            }
            alt="Album"
            width={500}
            height={500}
            loading="lazy"

          />
        </div>

        <div className="w-full bg-white/80 rounded-md p-3 mt-3">
          <button
            className="w-full text-center bg-[#182e49] rounded-md text-white p-3 text-[18px] inline-block m-auto"
            // onClick={handleShowPlayer}
          >
            Hörprobe hören
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
