import LogoSvg from "../assets/svg/logo.svg?react";

export default function Logo() {
    return (
        <div className="text-[1rem] flex items-center mb-[15px] font-bold">
            <LogoSvg className="w-[36px] h-[36px] dark:text-white text-black"/>
            <span className="ml-[7px] leading-4">New<br/>Art</span>
        </div>
    );

}