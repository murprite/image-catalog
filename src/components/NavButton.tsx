import { Link } from "react-router-dom";
import "./NavButton.css"

type NavProps = {
    IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    text: string;
    link: string;
};

export default function NavButton({
    IconComponent,
    text,
    link
}: NavProps) {
    return (
        <Link to={link} className="NavButton w-full text-left">
            <div
                className="
                    NavButton__btn
                    py-8
                    flex
                    items-center
                    w-full
                    cursor-pointer
                    transition

                    text-zinc-500
                    hover:text-zinc-900

                    dark:text-zinc-400
                    dark:hover:text-white
                "
            >
                <IconComponent
                    height="24px"
                    width="24px"
                    className="
                        transition
                        text-zinc-500
                        dark:text-zinc-400
                    "
                />

                <span className="ml-5">
                    {text}
                </span>
            </div>
        </Link>
    );
}