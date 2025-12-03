"use client"
import Link from "next/link"
import { Ionicons } from "../../types/ionicos"
import { usePathname } from "next/navigation";


export interface AppMenuItemProps {
    title: string,
    icon: Ionicons
    url: string
}

export default function AppMenuItem ({title, icon, url}: AppMenuItemProps) {

    const path = usePathname();
    const activaded = path.startsWith(url);

    return (
        <Link href={url}>
            <h1 className={`flex md:pl-[10px] py-[5px] cursor-pointer mb-[5px] rounded-s-full text-[17px] ${activaded ?  'text-white bg-(--primary-color)' : 'text-black' }`}>
                <i className={`ion-${icon} mx-2`} />
                <div className="hidden md:flex">{title}</div> 
            </h1>
        </Link>
    )
}