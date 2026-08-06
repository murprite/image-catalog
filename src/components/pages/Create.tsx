import { useEffect, useState } from "react";

import Sidebar from "../Sidebar";
import Header from "../Header";

type Tag = {
    id: string;
    name: string;
    color: string;
};

export default function Create() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [geo, setGeo] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8001/api/v1/tags")
            .then(r => r.json())
            .then(setTags);
    }, []);

    const upload = async () => {
        if (!file) return;

        const form = new FormData();

        form.append("file", file);
        form.append("title", title);
        form.append("author", author);
        form.append("geo", geo);

        selectedTags.forEach(tag => form.append("tags", tag));

        await fetch("http://127.0.0.1:8001/api/v1/images/upload", {
            method: "POST",
            body: form,
            credentials: "include"
        });
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

            <Sidebar />

            <div className="content w-full min-h-screen">

                <Header />

                <main className="max-w-5xl mx-auto p-8">

                    <h1 className="text-4xl font-bold mb-8">
                        Загрузить изображение
                    </h1>

                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* UPLOAD AREA */}
                        <div>

                            <label
                                className="
                                    border-2
                                    border-dashed
                                    border-zinc-300
                                    dark:border-zinc-700
                                    rounded-2xl
                                    h-[500px]
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    overflow-hidden
                                    bg-zinc-50
                                    dark:bg-zinc-900
                                "
                            >

                                {!preview && (
                                    <div className="text-zinc-500 dark:text-zinc-400">
                                        Выбрать изображение
                                    </div>
                                )}

                                {preview && (
                                    <img
                                        src={preview}
                                        className="w-full h-full object-contain bg-zinc-100 dark:bg-zinc-950"
                                    />
                                )}

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;

                                        setFile(f);
                                        setPreview(URL.createObjectURL(f));
                                    }}
                                />

                            </label>

                        </div>

                        {/* FORM */}
                        <div className="space-y-5">

                            <input
                                className="
                                    w-full
                                    rounded-xl
                                    p-4
                                    bg-zinc-100
                                    dark:bg-zinc-900
                                    border
                                    border-zinc-200
                                    dark:border-zinc-800
                                    outline-none
                                "
                                placeholder="Название"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />

                            <input
                                className="
                                    w-full
                                    rounded-xl
                                    p-4
                                    bg-zinc-100
                                    dark:bg-zinc-900
                                    border
                                    border-zinc-200
                                    dark:border-zinc-800
                                    outline-none
                                "
                                placeholder="Автор"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                            />

                            <input
                                className="
                                    w-full
                                    rounded-xl
                                    p-4
                                    bg-zinc-100
                                    dark:bg-zinc-900
                                    border
                                    border-zinc-200
                                    dark:border-zinc-800
                                    outline-none
                                "
                                placeholder="Локация"
                                value={geo}
                                onChange={e => setGeo(e.target.value)}
                            />

                            {/* TAGS */}
                            <div>
                                <h2 className="mb-3 font-semibold">
                                    Теги
                                </h2>

                                <div className="flex flex-wrap gap-2">

                                    {tags.map(tag => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTags(prev =>
                                                    prev.includes(tag.id)
                                                        ? prev.filter(x => x !== tag.id)
                                                        : [...prev, tag.id]
                                                );
                                            }}
                                            className="
                                                rounded-full
                                                px-4
                                                py-2
                                                text-white
                                                transition
                                            "
                                            style={{
                                                background: selectedTags.includes(tag.id)
                                                    ? tag.color
                                                    : "rgb(39 39 42)"
                                            }}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}

                                </div>
                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={upload}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-blue-600
                                    p-4
                                    text-white
                                    font-bold
                                    hover:bg-blue-500
                                    transition
                                "
                            >
                                Загрузить работу
                            </button>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}