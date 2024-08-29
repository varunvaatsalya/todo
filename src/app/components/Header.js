import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function Header() {
  return (
    <>
      <header className="h-[88px] w-full bg-white dark:bg-zinc-800 flex items-center">
        <div className="flex justify-center items-center gap-2 ml-3 md:ml-7 lg:ml-10 xl:ml-16">
          <Image
            height={800}
            width={800}
            src="Frame.svg"
            alt="Logo"
            className="w-8"
            priority
          />
          <div className={inter.className + " font-semibold text-2xl"}>
            TODO
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
