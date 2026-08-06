import { useEffect, useState } from "react";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Card from "../Card";

import { getFavorites } from "../../utils/favorites";

export default function FavoritesPage({
    isOpened,
    toggleSidebar,
}: any) {
    const [cards, setCards] = useState<any[]>([]);

    function loadFavorites() {
        const favs = getFavorites();
        setCards(favs);
    }

    useEffect(() => {
        loadFavorites();

        const handler = () => loadFavorites();

        window.addEventListener("favorites-updated", handler);

        return () =>
            window.removeEventListener("favorites-updated", handler);
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

            <Sidebar
                isOpened={isOpened}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex-1 min-w-0">

                <Header toggleSidebar={toggleSidebar} />

                <main className="p-8 min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

                    <h1 className="text-3xl font-bold mb-8">
                        Понравившиеся
                    </h1>

                    {cards.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Нет сохранённых изображений
                        </p>
                    ) : (
                        <div className="
                            columns-1
                            sm:columns-2
                            xl:columns-3
                            2xl:columns-4
                            gap-5
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