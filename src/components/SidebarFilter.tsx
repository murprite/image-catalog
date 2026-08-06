import { useEffect, useState } from "react";

export type FilterState = {
    orientation: "all" | "landscape" | "portrait" | "square";
    minWidth: number;
    minHeight: number;
    hdOnly: boolean;
    safeSearch: boolean;
    tags: string[];
};

type Tag = {
    id: string;
    name: string;
    color: string;
};

type Props = {
    filters: FilterState;
    setFilters: React.Dispatch<
        React.SetStateAction<FilterState>
    >;
};

export default function SidebarFilter({
    filters,
    setFilters,
}: Props) {

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8001/api/v1/tags")
            .then(r => r.json())
            .then(setTags);
    }, []);

    function toggleTag(id: string) {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(id)
                ? prev.tags.filter(
                    x => x !== id
                )
                : [...prev.tags, id]
        }));
    }

    function resetFilters() {
        setFilters({
            orientation: "all",
            minWidth: 0,
            minHeight: 0,
            hdOnly: false,
            safeSearch: true,
            tags: []
        });
    }

    return (
        <div className="Sidebar__filter">

            <h2 className="text-[1.75rem] mb-5 font-medium">
                Фильтр
            </h2>

            <div className="mb-8">

                <label className="mb-3 block text-[1.2rem] font-medium">
                    Ориентация
                </label>

                {[
                    ["all","Все"],
                    ["landscape","Альбомная"],
                    ["portrait","Вертикальная"],
                    ["square","Квадратная"]
                ].map(([value,text]) => (

                    <label
                        key={value}
                        className="
                            flex
                            items-center
                            gap-3
                            mb-3
                            cursor-pointer
                        "
                    >
                        <input
                            type="radio"
                            checked={
                                filters.orientation
                                === value
                            }
                            onChange={() =>
                                setFilters(prev => ({
                                    ...prev,
                                    orientation:
                                        value as any
                                }))
                            }
                        />

                        <span>
                            {text}
                        </span>

                    </label>

                ))}

            </div>

            <div className="mb-8">

                <label className="mb-3 block text-[1.2rem] font-medium">
                    Минимальное разрешение
                </label>

                <div className="grid grid-cols-2 gap-3">

                    <input
                        type="number"
                        value={
                            filters.minWidth
                        }
                        placeholder="Ширина"
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                minWidth:
                                Number(
                                    e.target.value
                                )
                            }))
                        }
                        className="
                            rounded-lg
                            bg-zinc-800
                            p-3
                        "
                    />

                    <input
                        type="number"
                        value={
                            filters.minHeight
                        }
                        placeholder="Высота"
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                minHeight:
                                Number(
                                    e.target.value
                                )
                            }))
                        }
                        className="
                            rounded-lg
                            bg-zinc-800
                            p-3
                        "
                    />

                </div>

            </div>

            <div className="mb-8">

                <label className="mb-3 block text-[1.2rem] font-medium">
                    Теги
                </label>

                <div className="flex flex-wrap gap-2">

                    {tags.map(tag => (

                        <button
                            key={tag.id}

                            onClick={() =>
                                toggleTag(
                                    tag.id
                                )
                            }

                            style={{
                                background:
                                filters.tags.includes(
                                    tag.id
                                )
                                ? tag.color
                                : "#27272a"
                            }}

                            className="
                                rounded-full
                                px-3
                                py-2
                                text-sm
                            "
                        >
                            {tag.name}
                        </button>

                    ))}

                </div>

            </div>

            <div className="mb-8">

                <label className="
                    flex
                    justify-between
                    mb-3
                ">

                    <span>
                        Только HD
                    </span>

                    <input
                        type="checkbox"
                        checked={
                            filters.hdOnly
                        }
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                hdOnly:
                                e.target.checked
                            }))
                        }
                    />

                </label>

                <label className="
                    flex
                    justify-between
                ">

                    <span>
                        Безопасный поиск
                    </span>

                    <input
                        type="checkbox"
                        checked={
                            filters.safeSearch
                        }
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                safeSearch:
                                e.target.checked
                            }))
                        }
                    />

                </label>

            </div>

            <div className="flex gap-3">

                <button
                    className="
                        flex-1
                        rounded-xl
                        bg-indigo-500
                        py-3
                    "
                >
                    Применить
                </button>

                <button
                    onClick={resetFilters}
                    className="
                        rounded-xl
                        border
                        border-zinc-700
                        px-4
                    "
                >
                    Сбросить
                </button>

            </div>

        </div>
    );
}