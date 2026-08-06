import searchIcon from "../assets/search-icon.svg";
import FilterIcon from "../assets/filter-icon.svg?react";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

type HeaderProps = {
    toggleSidebar: (state: boolean) => void;
    isOpened: boolean;
};

export default function Header({
    toggleSidebar,
    isOpened
}: HeaderProps) {
    const navigate = useNavigate();

    const [inputSearch, setInputSearch] =
        useState("");

    const inputHandler = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setInputSearch(e.target.value);
    };

    const submitHandler = (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const value = inputSearch.trim();

        if (!value) return;

        navigate(
            `/search?q=${encodeURIComponent(value)}`
        );
    };

    return (
        <header
            className="
                flex
                items-center
                justify-between
                w-full
                px-[30px]
                py-[10px]

                bg-white
                text-zinc-900
                border-b border-zinc-200

                dark:bg-zinc-950
                dark:text-zinc-100
                dark:border-zinc-800
            "
        >
            <form
                onSubmit={submitHandler}
                className="
                    ml-auto
                    flex
                    w-full
                    max-w-[700px]
                    mx-[15px]
                    rounded-lg
                    border
                    border-zinc-300

                    bg-zinc-100

                    dark:bg-zinc-900
                    dark:border-zinc-700
                "
            >
                <input
                    value={inputSearch}
                    onChange={inputHandler}
                    type="text"
                    name="search"
                    placeholder="Впишите желаемое изображение"
                    className="
                        w-full
                        px-[15px]
                        py-[12px]

                        bg-transparent
                        outline-none

                        text-zinc-900
                        placeholder:text-zinc-500

                        dark:text-zinc-100
                        dark:placeholder:text-zinc-400
                    "
                />



                {/* SEARCH BUTTON */}
                <button
                    type="submit"
                    className="
                        px-[18px]

                        rounded-r-lg

                        border-l
                        border-zinc-300
                        dark:border-zinc-700


                        hover:bg-zinc-200
                        dark:hover:bg-zinc-800

                        transition
                    "
                >
                    <img
                        src={searchIcon}
                        alt=""
                        className="
                            w-[18px]
                            h-[18px]
                            opacity-70
                            dark:opacity-90
                            dark:text-black
                        "
                    />
                </button>
            </form>

            <Link
                to="/create"
                className="
                    px-[22px]
                    py-[12px]

                    rounded-lg

                    border
                    border-zinc-300

                    text-sm
                    font-medium

                    hover:bg-zinc-100
                    dark:hover:bg-zinc-900

                    dark:border-zinc-700

                    transition
                "
            >
                Добавить изображение
            </Link>
        </header>
    );
}