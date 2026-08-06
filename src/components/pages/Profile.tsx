import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import Sidebar from "../Sidebar.tsx";

type UserProfile = {
    id: string;
    email: string;
    iconUrl?: string;
    login: string;
    createdAt: string;
    name: string;
};

type Image = {
    id: string;
    url: string;
};

export default function Profile() {
    const {id} = useParams<{ id: string }>();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [userRes, imagesRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8001/api/v1/users/${id}`),
                    fetch(`http://127.0.0.1:8001/api/v1/users/${id}/images`)
                ]);

                setUser(await userRes.json());
                setImages(await imagesRes.json());
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                User not found
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar/>
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center gap-6">
                    <img
                        src={user.iconUrl || "/default-avatar.png"}
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover border"
                    />

                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>

                        <p className="text-gray-500 mt-1">
                            {"No bio yet"}
                        </p>
                    </div>
                </div>

                {/* GALLERY */}
                <div className="mt-10">
                    <h2 className="text-lg font-semibold mb-4">Images</h2>

                    {images.length === 0 ? (
                        <p className="text-gray-500">No images yet</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt=""
                                    className="w-full aspect-square object-cover rounded-lg hover:opacity-80 transition"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}