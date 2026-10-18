import Logo from "./Logo.tsx";
import SidebarFilter from "./SidebarFilter.tsx";
import SidebarNav from "./SidebarNav.tsx";
import {useEffect, useState} from "react";
import {getTheme, setTheme} from "../utils/theme";

import clsx from "clsx";

import "./Sidebar.css";

type SidebarProps = {
    isOpened: boolean;
};


export default function Sidebar({
                                    isOpened,
                                    filters,
                                    setFilters
                                }: SidebarProps) {
    const [theme, setThemeState] = useState<"dark" | "light">("light");

    function toggleTheme() {
        const next =
            theme === "dark"
                ? "light"
                : "dark";

        setThemeState(next);
        setTheme(next);
    }


    useEffect(() => {
        const handler = () => {
            setThemeState(getTheme());
        };

        window.addEventListener(
            "theme-change",
            handler
        );

        return () =>
            window.removeEventListener(
                "theme-change",
                handler
            );
    }, []);

    return (
        <aside
            className={clsx(
                "icon",
                "h-screen",
                "w-125",
                "border-r",
                "border-zinc-200",
                "bg-white",
                "p-6",
                "top-0",
                "sticky",
                "text-black",
                isOpened ? "open" : "closed",
                "dark:bg-zinc-950",
                "dark:text-white",
                "dark:border-zinc-800"
            )}
        >
            <div className="Sidebar__header flex">
                <Logo/>

                <button
                    onClick={toggleTheme}
                    className="
                        w-[150px]
                        ml-auto
                        rounded-xl
                        border
                        border-zinc-700
                        px-4
                        py-3
                        text-sm
                        text-black

                        dark:bg-zinc-950
                        dark:text-white
                        dark:border-zinc-800
                    "
                >
                    {theme === "dark"
                        ? "Тёмная"
                        : "Светлая"}
                </button>
            </div>

            <div className="Sidebar__content">
                {isOpened
                    ? <SidebarFilter filters={filters} setFilters={setFilters}/>
                    : <SidebarNav/>}
            </div>
        </aside>
    );
}