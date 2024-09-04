"use server"

export const getServer = async () => {
    let response = await fetch("https://www.google.com", { mode: "no-cors" });
    if (response) {
        return { success: true };
    } else {
        return { success: false };
    }
}