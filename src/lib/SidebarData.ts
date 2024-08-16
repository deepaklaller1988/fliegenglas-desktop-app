import { AiFillExclamationCircle } from "react-icons/ai";
import { BiBarChart, BiGridAlt } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { GiFly } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { IoChatboxEllipsesOutline, IoLogOut, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { PiDotsThreeOutlineDuotone, PiDownloadSimpleBold } from "react-icons/pi";
import { TbBellRinging2Filled, TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TiUserDelete } from "react-icons/ti";

interface MenuItem {
    id: string;
    item: string;
    path?: string;
    icon?: any;
    type?: string;
    childrens?: MenuItem[];
    isOpen?: boolean;
    size?: number;
    name?: string;
}
export default class Menu {
    static list: MenuItem[] = [
        // 8
        {
            id: "home",
            item: "Startseite",
            path: "/home",
            type: "link",
            icon: GoHome,
            size: 20,
        },
        {
            id: "search",
            item: "Suche",
            path: "/search",
            type: "link",
            icon: IoSearch,
            size: 20,
        },
        {
            id: "audiobooks",
            item: "Meine Hörbücher",
            path: "/my-audiobooks",
            type: "link",
            icon: BiBarChart,
            size: 20,
        },
        // {
        //     id: "more",
        //     item: "Mehr",
        //     path: "",
        //     type: "sub-options",
        //     icon: PiDotsThreeOutlineDuotone,
        //     size: 20,
        // },
    ];

    static sublist: MenuItem[] = [
        // 8
        {
            id: "settings",
            item: "Einstellungen",
            path: "/settings/subscriptions",
            type: "link",
            icon: IoSettingsOutline,
            size: 20,
        },
        {
            id: "downloads",
            item: "Downloads",
            path: "/settings/downloads",
            type: "link",
            icon: PiDownloadSimpleBold,
            size: 20,
        },
        {
            id: "email",
            item: "E-Mail-Adresse",
            path: "/settings/update-email",
            type: "link",
            icon: MdOutlineMail,
            size: 20,
        },
        {
            id: "username",
            item: "Dein Name",
            path: "/settings/update-username",
            type: "link",
            icon: FaRegUser,
            size: 20,
        },
        {
            id: "categories",
            item: "Lieblingskategorien",
            path: "/settings/favourite",
            type: "link",
            icon: BiGridAlt,
            size: 20,
        },
        {
            id: "notifications",
            item: "Benachrichtigungen",
            path: "/settings/notifications",
            type: "link",
            icon: TbBellRinging2Filled,
            size: 20,
        },
        {
            id: "logout",
            item: "Aus der App ausloggen",
            path: "/settings/logout",
            type: "logout",
            icon: IoLogOut,
            size: 20,
        },
    ];

    static subInfoList: MenuItem[] = [
        // 8
        {
            id: "about",
            item: "Über uns",
            path: "/information/about-us",
            type: "link",
            icon: GiFly,
            size: 20,
        },
        {
            id: "faq",
            item: "Häufig gestellte Fragen (FAQ)",
            path: "/information/faq",
            type: "link",
            icon: AiFillExclamationCircle,
            size: 20,
        },
        {
            id: "feedback",
            item: "Dein Feedback",
            path: "/information/feedback",
            type: "link",
            icon: IoChatboxEllipsesOutline,
            size: 20,
        },
        {
            id: "impressum",
            item: "Impressum",
            path: "/information/impressum",
            type: "link",
            icon: AiFillExclamationCircle,
            size: 20,
        },
        {
            id: "terms",
            item: "Nutzungsbedingungen (AGB)",
            path: "/information/terms",
            type: "link",
            icon: AiFillExclamationCircle,
            size: 20,
        },
        {
            id: "privacy",
            item: "Datenschutzerklärung",
            path: "/information/privacy",
            type: "link",
            icon: AiFillExclamationCircle,
            size: 20,
        },
        {
            id: "revocation",
            item: "Widerrufsrecht",
            path: "/information/revocation",
            type: "link",
            icon: AiFillExclamationCircle,
            size: 20,
        },
        {
            id: "delete-account",
            item: "Kundenkonto löschen",
            path: "/information/delete-account",
            type: "link",
            icon: TiUserDelete,
            size: 20,
        },
    ];
}
