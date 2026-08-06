const KEY = "favorites";

export type FavoriteCard = {
    id: string;
    imageUrl: string;
    title: string;
    author: string;
    width?: number;
    height?: number;
};

export function getFavorites(): FavoriteCard[] {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function isFavorite(id: string): boolean {
    return getFavorites().some(x => x.id === id);
}

export function toggleFavorite(card: FavoriteCard): FavoriteCard[] {
    const favs = getFavorites();

    const exists = favs.some(x => x.id === card.id);

    const updated = exists
        ? favs.filter(x => x.id !== card.id)
        : [...favs, card];

    localStorage.setItem(KEY, JSON.stringify(updated));

    return updated;
}