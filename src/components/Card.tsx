import "./Card.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    isFavorite,
    toggleFavorite,
} from "../utils/favorites";

export type CardProps = {
    id: string;
    imageUrl: string;
    title: string;
    author: string;
    width?: number;
    height?: number;
    tags?: string[];
};

export default function Card(props: CardProps) {
    const {
        id,
        imageUrl,
        title,
        author,
        width,
        height,
    } = props;

    const [favorite, setFavorite] =
        useState(false);

    useEffect(() => {
        setFavorite(isFavorite(id));
    }, [id]);

    const makeFavorite = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const updated = toggleFavorite({
            id,
            imageUrl,
            title,
            author,
            width,
            height,
        });

        setFavorite(
            updated.some(x => x.id === id)
        );

        window.dispatchEvent(
            new Event("favorites-updated")
        );
    };

    return (
        <Link to={`/cards/${id}`}>
            <div className="group cursor-pointer relative mb-5 break-inside-avoid overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">

                <img
                    src={imageUrl}
                    alt={title}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                    <div className="flex items-center justify-between">

                        <div>
                            <h3 className="text-sm font-medium text-zinc-100">
                                {title}
                            </h3>

                            <p className="mt-1 text-xs text-zinc-400">
                                {!author || ""}
                            </p>
                        </div>

                        <button
                            onClick={makeFavorite}
                            className={`
                                ${favorite ? "active" : ""}
                                cursor-pointer
                                transition
                                text-zinc-400
                                hover:text-red-300
                                rounded-lg
                                bg-zinc-900/80
                                p-2
                                text-xs
                                backdrop-blur
                            `}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                height="24"
                                width="24"
                            >
                                <use href="#heart" />
                                <use href="#heart" />
                            </svg>

                            <svg className="hide" viewBox="0 0 24 24" height="24" width="24">
                                <defs>
                                    <path
                                        id="heart"
                                        d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
                                    />
                                </defs>
                            </svg>
                        </button>

                    </div>

                </div>

            </div>
        </Link>
    );
}