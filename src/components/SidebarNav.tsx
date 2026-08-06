import NavButton from "./NavButton.tsx";

// Icons
import HomeIcon from "../assets/svg/home.svg?react"
import SearchIcon from "../assets/svg/search-icon.svg?react"
import FireIcon from "../assets/svg/fire.svg?react"
import ProfileIcon from "../assets/svg/profile.svg?react"
import HeartIcon from "../assets/svg/heart-icon.svg?react"

export default function SidebarNav() {
    return (
        <nav className="flex mt-6 flex-col items-center justify-between">
            <NavButton link={"/"} IconComponent={HomeIcon} text="Главная страница"/>
            <NavButton link={"/discovery"} IconComponent={SearchIcon} text="Открытия"/>
            <NavButton link={"/popular"} IconComponent={FireIcon} text="Популярное"/>
            <NavButton link={"/favorites"} IconComponent={HeartIcon} text="Понравившиеся"/>
            <NavButton link={"/charts"} IconComponent={ProfileIcon} text="Статистика"/>
            {/*<NavButton link={"/profile"}  text="Личный кабинет"/>*/}
        </nav>
    );
}