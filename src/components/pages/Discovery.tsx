import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import Sidebar from "../Sidebar";
import Header from "../Header";

type Tag = {
    id: string;
    name: string;
    color: string;
};

type Image = {
    id: string;
    title: string;
    author: string;
    url: string;
};

export default function Discovery() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [images, setImages] = useState<Record<string, Image[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const tagsRes = await fetch(
                "http://127.0.0.1:8001/api/v1/tags"
            );

            const tagsData = await tagsRes.json();

            setTags(tagsData);

            const categoryImages: Record<string, Image[]> = {};

            await Promise.all(
                tagsData.map(async (tag: Tag) => {
                    const res = await fetch(
                        `http://127.0.0.1:8001/api/v1/images/by-tags?tags=${tag.id}&limit=10`
                    );

                    const data = await res.json();

                    categoryImages[tag.id] = data.items ?? [];
                })
            );

            setImages(categoryImages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 min-w-0 w-full bg-white dark:bg-zinc-950 transition-colors">
                <Header />

                <main className="overflow-hidden p-8">

                    <div className="mb-10">
                        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white">
                            Открытия
                        </h1>

                        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                            Новые изображения по категориям.
                        </p>
                    </div>

                    <Swiper
                        spaceBetween={12}
                        slidesPerView={"auto"}
                        className="mb-10"
                    >
                        {tags.map(tag => (
                            <SwiperSlide
                                key={tag.id}
                                style={{
                                    width: "fit-content",
                                }}
                            >
                                <a
                                    href={`#${tag.id}`}
                                    className="
                                        block
                                        rounded-full
                                        px-5
                                        py-2
                                        text-white
                                        transition
                                        hover:scale-105
                                    "
                                    style={{
                                        background: tag.color,
                                    }}
                                >
                                    {tag.name}
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {loading && (
                        <div className="text-zinc-500 dark:text-zinc-400">
                            Loading...
                        </div>
                    )}

                    {!loading &&
                        tags.map(tag => (
                            <section
                                key={tag.id}
                                id={tag.id}
                                className="mb-14"
                            >
                                <div className="flex items-center gap-3 mb-5">

                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                            background: tag.color,
                                        }}
                                    />

                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                        {tag.name}
                                    </h2>

                                </div>

                                <Swiper
                                    spaceBetween={20}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1.2,
                                        },
                                        640: {
                                            slidesPerView: 2.2,
                                        },
                                        1024: {
                                            slidesPerView: 3.2,
                                        },
                                        1400: {
                                            slidesPerView: 4.2,
                                        },
                                    }}
                                >
                                    {(images[tag.id] ?? []).map(image => (
                                        <SwiperSlide
                                            key={image.id}
                                        >
                                            <Link
                                                to={`/cards/${image.id}`}
                                            >
                                                <div
                                                    className="
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        border-zinc-200
                                                        dark:border-zinc-800
                                                        bg-zinc-100
                                                        dark:bg-zinc-900
                                                        transition
                                                        hover:scale-[1.02]
                                                    "
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.title}
                                                        className="
                                                            h-72
                                                            w-full
                                                            object-cover
                                                        "
                                                    />

                                                    <div className="p-4">

                                                        <h3
                                                            className="
                                                                font-semibold
                                                                text-zinc-900
                                                                dark:text-white
                                                            "
                                                        >
                                                            {image.title}
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-sm
                                                                text-zinc-500
                                                                dark:text-zinc-400
                                                            "
                                                        >
                                                            {image.author}
                                                        </p>

                                                    </div>

                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                            </section>
                        ))}

                </main>
            </div>
        </div>
    );
}