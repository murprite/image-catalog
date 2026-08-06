
/*
*  Добавить светлую тему
*  фильтры
*  личные кабинеты
* */

import { Routes, Route } from "react-router-dom";
import './App.css'

// Pages
import Home from "./components/pages/Home";
import Gallery from "./components/pages/Gallery";
import Favorites from "./components/pages/Favorites.tsx";
import Discovery from "./components/pages/Discovery.tsx";
import Profile from "./components/pages/Profile.tsx";
import Popular from "./components/pages/Popular.tsx";
import CardPage from "./components/pages/CardPage.tsx";
import Create from "./components/pages/Create.tsx";
import SearchPage from "./components/pages/SearchPage.tsx";
import ChartPage from "./components/pages/ChartPage.tsx";


export default function App() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/cards/:id" element={<CardPage />}/>
            <Route path="/create" element={<Create />}/>
            <Route path="/search" element={<SearchPage />}/>
            <Route path="/charts" element={<ChartPage />}/>
        </Routes>
    );
}
