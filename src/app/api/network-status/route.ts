import { NextResponse } from "next/server";
import https from 'https';

async function checkInternetConnectivity() {
    return new Promise((resolve) => {
        const request = https.request('https://www.google.com', (response) => {
            resolve(response.statusCode === 200);
        });

        request.on('error', () => {
            resolve(false);
        });

        request.end();
    });
}

export const GET = async (request: Request) => {
    try {
        const isConnected = await checkInternetConnectivity();
        if (isConnected) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}