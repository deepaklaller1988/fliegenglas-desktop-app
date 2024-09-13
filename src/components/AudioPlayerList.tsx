import Image from "next/image";
import { IoMdClose } from "react-icons/io";

const AudioPlayerList = ({
  audioDetail,
  handleShowList,
  handleCurrentAudio,
  currentAudio,
}: any) => {
  return (
    <div className="absolute inset-0 bg-black z-20 h-full ">
      <div className="absolute inset-0 h-full z-[-1] bg-black">
        <Image
          src={
            audioDetail?.imageUrl.includes("assets")
              ? "/" + audioDetail?.imageUrl
              : audioDetail?.imageUrl || "/image-placeholder.png"
          }
          alt="Background Image"
          fill={true}
          className="blur-2xl opacity-65 object-fit"
          loading="lazy"
        />
      </div>
      <div className="max-h-screen w-[90vw] h-full m-auto">
        <div className="lg:mx-20 flex flex-col">
          <div className="flex flex-row justify-between items-center h-1/12 pt-8 mx-10 mb-5">
            <Image
              src={
                audioDetail?.imageUrl.includes("assets")
                  ? "/" + audioDetail?.imageUrl
                  : audioDetail?.imageUrl || "/image-placeholder.png"
              }
              alt="Audio Thumbnail"
              height={200}
              width={200}
              className="rounded-xl shadow-lg h-40 w-auto"
              loading="lazy"
            />
            <button
              className="flex flex-row items-center gap-2 text-white hover:bg-white/10 hover:shadow-xl p-2 rounded-lg duration-300"
              onClick={handleShowList}
            >
              <IoMdClose size={25} />
              Schließen
            </button>
          </div>
          <ul className="mt-4 flex flex-col gap-3 overflow-y-scroll h-[70vh]">
            {audioDetail?.list?.length > 0 ? (
              audioDetail?.list?.map((item: any, index: number) => (
                <li
                  key={item?.id}
                  className="rounded-lg py-0 px-4 bg-white/80 text-black hover:bg-white hover:shadow-xl duration-300 cursor-pointer flex flex-row items-center mx-10"
                >
                  <div
                    className="w-full py-3"
                    onClick={() => {
                      handleCurrentAudio(index);
                      handleShowList();
                    }}
                  >
                    <h1 className="font-semibold text-lg">{item?.title}</h1>
                    <p className="text-[16px] text-gray-600">{item?.name}</p>
                    <div className="flex justify-between items-center h-7">
                      <p className="text-gray-500 mt-1">{item?.duration}</p>
                      {index === currentAudio && (
                        <Image
                          src="/assets/fly.gif"
                          alt="flie seelctor"
                          width={30}
                          height={100}
                          // className="h-7"
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center">No audio found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerList;
