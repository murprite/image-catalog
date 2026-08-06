import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "../Sidebar";
import Header from "../Header";

export default function ChartPage() {
    const [dataViews, setDataViews] = useState<any[]>([]);
    const [dataTags, setDataTags] = useState<any[]>([]);

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const reportUrl = (path: string) => {
        const params = new URLSearchParams();

        if (dateFrom) {
            params.append("date_from", dateFrom);
        }

        if (dateTo) {
            params.append("date_to", dateTo);
        }

        return `http://127.0.0.1:8001/api/v1/report${path}?${params.toString()}`;
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8001/api/v1/images/stats/views-by-day")
            .then(r => r.json())
            .then(setDataViews);

        fetch("http://127.0.0.1:8001/api/v1/images/stats/image_tags")
            .then(r => r.json())
            .then(setDataTags);
    }, []);

    const cumulativeViews = useMemo(() => {
        let total = 0;

        return dataViews.map(item => {
            total += item.count;

            return {
                date: item.date,
                count: total,
            };
        });
    }, [dataViews]);

    if (!dataViews.length || !dataTags.length) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-500">
                    Загрузка...
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex-1">

                <Header />

                <main className="p-8">

                    <h1 className="text-4xl font-bold text-gray-800 mb-8">
                        Статистика
                    </h1>
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

    <div className="flex flex-wrap justify-between gap-6">

        <div>

            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Период формирования отчётов
            </h2>

            <div className="flex gap-3 flex-wrap">

                <div>

                    <label className="block text-sm text-gray-500 mb-1">
                        От
                    </label>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="
                            border
                            rounded-lg
                            p-2
                            border-gray-300
                        "
                    />

                </div>

                <div>

                    <label className="block text-sm text-gray-500 mb-1">
                        До
                    </label>

                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="
                            border
                            rounded-lg
                            p-2
                            border-gray-300
                        "
                    />

                </div>

                <div className="flex items-end">

                    <button
                        onClick={() => {
                            setDateFrom("");
                            setDateTo("");
                        }}
                        className="
                            bg-blue-600
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            hover:bg-blue-700
                        "
                    >
                        Сбросить
                    </button>

                </div>

            </div>

        </div>

        <div>

            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Отчёты
            </h2>

            <div className="flex flex-wrap gap-3">

                <a
                    href={reportUrl("/")}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        bg-green-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-green-700
                    "
                >
                    PDF изображений
                </a>

                <a
                    href={reportUrl("/tags")}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        bg-purple-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-purple-700
                    "
                >
                    PDF тегов
                </a>

                <a
                    href={reportUrl("/excel")}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        bg-emerald-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-emerald-700
                    "
                >
                    Excel
                </a>

                <a
                    href={reportUrl("/authors")}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        bg-emerald-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-emerald-700
                    "
                >
                    Отчёты по авторам
                </a>

                <a
                    href={reportUrl("/tags-images")}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        bg-emerald-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-emerald-700
                    "
                >
                    Отчёты по тегам
                </a>

            </div>

        </div>

    </div>

</div>


                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* Просмотры по дням */}

                        <div className="bg-white rounded-2xl shadow-lg p-6">

                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Просмотры изображений по дням
                            </h2>

                            <div className="h-[400px]">

                                <ResponsiveContainer width="100%" height="100%">

                                    <LineChart data={dataViews}>

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(v) =>
                                                new Date(v).toLocaleDateString(
                                                    "ru-RU",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                    }
                                                )
                                            }
                                        />

                                        <YAxis />

                                        <Tooltip
                                            labelFormatter={(v) =>
                                                new Date(v).toLocaleDateString(
                                                    "ru-RU",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        />

                                        <Line
                                            dataKey="count"
                                            stroke="#2563eb"
                                            strokeWidth={3}
                                            name="Просмотры"
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* Pie */}

                        <div className="bg-white rounded-2xl shadow-lg p-6">

                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Распределение изображений по тегам
                            </h2>

                            <div className="h-[400px]">

                                <ResponsiveContainer width="100%" height="100%">

                                    <PieChart>

                                        <Pie
                                            data={dataTags}
                                            dataKey="count"
                                            nameKey="name"
                                            outerRadius={120}
                                            label
                                        >
                                            {dataTags.map(tag => (
                                                <Cell
                                                    key={tag.id}
                                                    fill={tag.color}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* Накопительные просмотры */}

                        <div className="bg-white rounded-2xl shadow-lg p-6">

                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Накопительное количество просмотров
                            </h2>

                            <div className="h-[400px]">

                                <ResponsiveContainer width="100%" height="100%">

                                    <LineChart data={cumulativeViews}>

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(v) =>
                                                new Date(v).toLocaleDateString(
                                                    "ru-RU",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                    }
                                                )
                                            }
                                        />

                                        <YAxis />

                                        <Tooltip
                                            labelFormatter={(v) =>
                                                new Date(v).toLocaleDateString(
                                                    "ru-RU",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        />

                                        <Line
                                            dataKey="count"
                                            stroke="#16a34a"
                                            strokeWidth={3}
                                            name="Просмотры"
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* Гистограмма тегов */}

                        <div className="bg-white rounded-2xl shadow-lg p-6">

                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Количество изображений по тегам
                            </h2>

                            <div className="h-[400px]">

                                <ResponsiveContainer width="100%" height="100%">

                                    <BarChart
                                        data={dataTags}
                                        layout="vertical"
                                    >

                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis type="number" />

                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={100}
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="count"
                                            name="Изображения"
                                        >
                                            {dataTags.map(tag => (
                                                <Cell
                                                    key={tag.id}
                                                    fill={tag.color}
                                                />
                                            ))}
                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}