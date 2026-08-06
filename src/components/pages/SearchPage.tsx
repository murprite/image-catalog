import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Card from "../Card";

import type { CardProps } from "../Card";

export default function SearchPage() {
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") ?? "";

    const [cards, setCards] = useState<CardProps[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadImages() {
            if (!query) {
                setCards([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(
                    `http://127.0.0.1:8001/api/v1/images/search?q=${encodeURIComponent(query)}`
                );

                const data = await response.json();
                const images = data.items ?? data;

                setCards(
                    images.map((image: any) => ({
                        id: image.id,
                        imageUrl: image.url,
                        title: image.title,
                        description: image.description ?? "",
                        width: image.width ?? 0,
                        height: image.height ?? 0,
                        isFavorite: image.is_favorite ?? false
                    }))
                );
            } catch (e) {
                console.error(e);
                setCards([]);
            } finally {
                setLoading(false);
            }
        }

        loadImages();
    }, [query]);

    return (
        <div className="flex min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

            <Sidebar />

            <div className="flex-1 min-w-0">

                <Header />

                <main className="p-8 min-h-screen">

                    <div className="mb-10">
                        <h1 className="text-4xl font-bold">
                            Поиск
                        </h1>

                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Результаты по запросу "{query}"
                        </p>
                    </div>

                    {loading && (
                        <div className="text-zinc-500 dark:text-zinc-400">
                            Загрузка...
                        </div>
                    )}

                    {!loading && cards.length === 0 && (
                        <div className="text-zinc-500 dark:text-zinc-400">
                            Ничего не найдено.
                        </div>
                    )}

                    {!loading && cards.length > 0 && (
                        <div className="
                            columns-1
                            gap-5
                            sm:columns-2
                            xl:columns-3
                            2xl:columns-4
                        ">
                            {cards.map(card => (
                                <Card
                                    key={card.id}
                                    {...card}
                                />
                            ))}
                        </div>
                    )}

                </main>

            </div>

        </div>
    );
}