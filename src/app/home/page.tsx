
"use client"
import { useUser } from "../../context/UserContext"

export default function Home() {

    const {user}:any = useUser();
    console.log(user, "update");
    return (<>
        Heloo
    </>)
}