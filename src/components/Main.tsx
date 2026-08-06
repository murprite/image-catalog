import Card from "./Card.tsx";
import type { CardProps } from "./Card.tsx";

import Header from "./Header.tsx";
import { useEffect, useState } from "react";

export default function Main({
    isOpened,
    toggleSidebar,
    filters
}: any) {
    const [cards, setCards] = useState<CardProps[]>([]);
    const [currentPage, setPage] = useState<number>(1);

    useEffect(() => {
        fetch(
            `http://127.0.0.1:8001/api/v1/images/?limit=20&page=${currentPage}`
        )
            .then(res => res.json())
            .then(data => {
                const mapped: CardProps[] = data.map(
                    (image: any) => ({
                        id: image.id,
                        imageUrl: image.url,
                        title: image.title,
                        author: image.author,
                        isFavorite: image.is_favorite ?? false,
                    })
                );

                setCards(mapped);
            })
            .catch(console.error);
    }, [currentPage, filters]);

    return (
        <div
            className="
                min-h-screen
                w-full

                bg-white
                text-zinc-900

                dark:bg-zinc-950
                dark:text-zinc-100
            "
        >
            <Header
                toggleSidebar={toggleSidebar}
                isOpened={isOpened}
            />

            <main
                className="
                    flex-1
                    overflow-y-auto

                    p-8

                    bg-white
                    text-zinc-900

                    dark:bg-zinc-950
                    dark:text-zinc-100
                "
            >
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight

                                text-zinc-900
                                dark:text-zinc-100
                            "
                        >
                            Галерея
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm

                                text-zinc-500
                                dark:text-zinc-400
                            "
                        >
                            {cards.length} изображений
                        </p>
                    </div>

                    <button
                        className="
                            rounded-xl
                            border

                            border-zinc-300
                            bg-zinc-100
                            text-zinc-800

                            dark:border-zinc-700
                            dark:bg-zinc-900
                            dark:text-zinc-200

                            px-5
                            py-3
                            text-sm
                            transition

                            hover:bg-zinc-200
                            dark:hover:bg-zinc-800
                        "
                    >
                        Перемешать
                    </button>
                </div>

                <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
                    {cards.map(card => (
                        <Card
                            key={card.id}
                            id={card.id}
                            imageUrl={card.imageUrl}
                            title={card.title}
                            author={card.author}
                            isFavorite={card.isFavorite}
                        />
                    ))}
                </div>
            </main>

            <div
                className="
                    flex
                    gap-2
                    py-7
                    mt-4
                    items-center

                    bg-white
                    text-zinc-900

                    dark:bg-zinc-950
                    dark:text-zinc-100
                "
            >
                <button
                    className="
                        ml-auto

                        rounded-lg
                        border

                        border-zinc-300
                        text-zinc-800

                        dark:border-zinc-700
                        dark:text-zinc-200

                        font-bold
                        px-[15px]
                        py-[10px]

                        transition

                        hover:bg-zinc-200
                        dark:hover:bg-zinc-800
                    "
                    disabled={currentPage === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Предыдущая
                </button>

                <span className="mx-7">
                    {currentPage}
                </span>

                <button
                    className="
                        mr-auto

                        rounded-lg
                        border

                        border-zinc-300
                        text-zinc-800

                        dark:border-zinc-700
                        dark:text-zinc-200

                        font-bold
                        px-[15px]
                        py-[10px]

                        transition

                        hover:bg-zinc-200
                        dark:hover:bg-zinc-800
                    "
                    onClick={() => setPage(p => p + 1)}
                >
                    Следующая
                </button>
            </div>
        </div>
    );
}