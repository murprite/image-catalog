import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../Sidebar";
import Header from "../Header";

type Image = {
    id: string;
    title: string;
    author: string;
    url: string;
};

type Tag = {
    id: string;
    name: string;
    color: string;
};

type ImageStats = {
    downloads: number;
    likes: number;
    views: number;
    created_at: string;
};

type ImageMetadata = {
    width: number;
    height: number;
    geo: string;
    author_id: string;
};

type Comment = {
    id: string;
    user_id: string;
    text: string;
    created_at: string;
};

export default function CardPage() {
    const { id } = useParams();

    const [image, setImage] = useState<Image | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [stats, setStats] = useState<ImageStats | null>(null);
    const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                const [
                    imageRes,
                    tagsRes,
                    statsRes,
                    metadataRes,
                    commentsRes
                ] = await Promise.all([
                    fetch(`http://127.0.0.1:8001/api/v1/images/${id}`),
                    fetch(`http://127.0.0.1:8001/api/v1/images/${id}/tags`),
                    fetch(`http://127.0.0.1:8001/api/v1/images/${id}/stats`),
                    fetch(`http://127.0.0.1:8001/api/v1/images/${id}/metadata`),
                    fetch(`http://127.0.0.1:8001/api/v1/images/${id}/comments`)
                ]);

                setImage(await imageRes.json());
                setTags(await tagsRes.json());
                setStats(await statsRes.json());
                setMetadata(await metadataRes.json());
                setComments(await commentsRes.json());
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="content w-full min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                    <Header />
                    <div className="p-8">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="content w-full min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                    <Header />
                    <div className="p-8 text-red-500 dark:text-red-400">
                        Image not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="content w-full min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                <Header />

                <main className="p-8">
                    <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* IMAGE */}
                        <div className="lg:col-span-2">

                            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">

                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="
                                        w-full
                                        max-h-[80vh]
                                        object-contain
                                        bg-zinc-100
                                        dark:bg-zinc-950
                                    "
                                />

                            </div>

                            {/* COMMENTS */}
                            <div className="mt-8">

                                <h2 className="text-2xl font-bold mb-4">
                                    Комментарии
                                </h2>

                                <div className="space-y-4">

                                    {comments.length === 0 && (
                                        <div className="text-zinc-500 dark:text-zinc-400">
                                            Нет комментариев.
                                        </div>
                                    )}

                                    {comments.map(comment => (
                                        <div
                                            key={comment.id}
                                            className="
                                                rounded-xl
                                                border
                                                border-zinc-200
                                                dark:border-zinc-800
                                                bg-zinc-50
                                                dark:bg-zinc-900
                                                p-4
                                            "
                                        >
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {comment.user_id}
                                            </div>

                                            <div className="mt-2 text-zinc-800 dark:text-zinc-200">
                                                {comment.text}
                                            </div>

                                            <div className="mt-2 text-xs text-zinc-400">
                                                {comment.created_at}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR INFO */}
                        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 h-fit">

                            <h1 className="text-3xl font-bold">
                                {image.title}
                            </h1>

                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                {image.author}
                            </p>

                            {/* STATS */}
                            <div className="mt-6">
                                <h2 className="font-semibold">
                                    Статистика
                                </h2>

                                <div className="mt-3 space-y-2 text-sm">

                                    <div className="flex justify-between">
                                        <span>Лайки</span>
                                        <span className="text-zinc-600 dark:text-zinc-300">
                                            {stats?.likes}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Просмотры</span>
                                        <span className="text-zinc-600 dark:text-zinc-300">
                                            {stats?.views}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Скачивания</span>
                                        <span className="text-zinc-600 dark:text-zinc-300">
                                            {stats?.downloads}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            {/* METADATA */}
                            <div className="mt-6">
                                <h2 className="font-semibold">
                                    Доп. информация
                                </h2>

                                <div className="mt-3 space-y-2 text-sm">

                                    <div className="flex justify-between">
                                        <span>Разрешение</span>
                                        <span className="text-zinc-600 dark:text-zinc-300">
                                            {metadata?.width} × {metadata?.height}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Локация</span>
                                        <span className="text-zinc-600 dark:text-zinc-300 text-right">
                                            {metadata?.geo}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            {/* TAGS */}
                            <div className="mt-6">

                                <h2 className="font-semibold mb-3">
                                    Теги
                                </h2>

                                <div className="flex flex-wrap gap-2">

                                    {tags.map(tag => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full px-3 py-1 text-sm text-white"
                                            style={{ backgroundColor: tag.color }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}