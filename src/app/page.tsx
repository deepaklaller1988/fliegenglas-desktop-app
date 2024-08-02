import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="/login"
          className="text-white"
        >
          <h2 className="mb-3 text-2xl font-semibold">
          Login
          </h2>
        </a>

      

       
      </div>
    </main>
  );
}
