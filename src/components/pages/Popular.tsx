import { useEffect, useMemo, useState } from "react";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Card from "../Card";

import type { CardProps } from "../Card";

type Period = "day" | "week" | "all";

export default function Popular({
    isOpened,
    toggleSidebar,
    filters,
}: any) {
    const [cards, setCards] = useState<CardProps[]>([]);
    const [period, setPeriod] = useState<Period>("week");

    useEffect(() => {
        fetch(
            `http://127.0.0.1:8001/api/v1/images?limit=100&sort=popular&period=${period}`
        )
            .then(res => res.json())
            .then(data => {
                const mapped: CardProps[] = (data.items ?? data).map(
                    (image: any) => ({
                        id: image.id,
                        imageUrl: image.url,
                        title: image.title,
                        author: image.author,
                        width: image.width ?? 0,
                        height: image.height ?? 0,
                        isFavorite: image.is_favorite ?? false,
                        tags: image.tags ?? [],
                        likes: image.likes ?? 0,
                        views: image.views ?? 0,
                    })
                );

                setCards(mapped);
            })
            .catch(console.error);
    }, [period]);

    const sortedCards = useMemo(() => {
        return [...cards].sort((a: any, b: any) => {
            return (b.views ?? 0) - (a.views ?? 0);
        });
    }, [cards]);

    return (
        <div className="flex min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

            <Sidebar isOpened={isOpened} />

            <div className="flex-1 min-w-0">

                <Header toggleSidebar={toggleSidebar} />

                <main className="p-8 min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

                    {/* HEADER */}
                    <div className="mb-10 flex items-center justify-between">

                        <div>
                            <h1 className="text-3xl font-bold">
                                Популярное
                            </h1>

                            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                Самые просматриваемые изображения
                            </p>
                        </div>

                        {/* PERIOD SWITCH */}
                        <div className="flex gap-2">

                            {(["day", "week", "all"] as Period[]).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`
                                        px-4
                                        py-2
                                        rounded-lg
                                        text-sm
                                        border
                                        transition

                                        ${period === p
                                            ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                                            : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                        }
                                    `}
                                >
                                    {p === "day" && "День"}
                                    {p === "week" && "Неделя"}
                                    {p === "all" && "Всё время"}
                                </button>
                            ))}

                        </div>

                    </div>

                    {/* GRID */}
                    <div className="
                        columns-1
                        gap-5
                        sm:columns-2
                        xl:columns-3
                        2xl:columns-4
                    ">
                        {sortedCards.map(card => (
                            <Card
                                key={card.id}
                                {...card}
                            />
                        ))}
                    </div>

                </main>

            </div>

        </div>
    );
}