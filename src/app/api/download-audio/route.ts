import { NextResponse } from "next/server";
import { checkToken } from "utils/token";

export const POST = async (request: Request) => {
    try {
        const token = await request.json();
        const check: any = await checkToken(token);

        if (!check.success) {
            return NextResponse.json({ success: false, ERR_CODE: "Invalid token", message: "Your token is invalid" }, { status: 500 });
        }

        const response = await fetch(check?.data?.file);
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer);

    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}