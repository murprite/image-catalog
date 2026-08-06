import Sidebar from "../Sidebar.tsx";
import Main from "../Main.tsx";
import { useState} from "react";


export default function Home() {
    const [isOpened, setOpen] = useState(false);
    // const [filters, setFilters] = useState<FilterState>({
    //     orientation: "all",
    //     minWidth: 0,
    //     minHeight: 0,
    //     hdOnly: false,
    //     safeSearch: true,
    //     tags: []
    // });

    return (
        <div className="flex">
            <Sidebar isOpened={isOpened} />
            <Main toggleSidebar={setOpen} isOpened={isOpened} />
        </div>
    );
}