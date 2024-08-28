import { NextResponse } from "next/server";
import { checkToken } from "utils/token";

export const POST1 = async (request: Request) => {
    try {
        let token = await request.json();
        let check: any = await checkToken(token);
        if (!check.success) {
            return NextResponse.json({ success: false, ERR_CODE: "Invalid token", message: "Your token is invalid" }, { status: 500 });
        }

        // const buffers = await Promise.all(
        //     check?.data?.audios?.map(async (audio: { file: string; title: string; duration: string; id: string; }) => {
        //         const response = await fetch(audio.file);
        //         const arrayBuffer = await response.arrayBuffer();

        //         // Update progress
        //         progress += 1;
        //         console.log(`Progress: ${progress}/${check?.data?.audios?.length} files downloaded`);

        //         return { id: audio.id, title: audio.title, duration: audio.duration, buffer: arrayBuffer };
        //     })
        // );

        // console.log(buffers, 'All files downloaded');

        const response = await fetch(check?.data?.file);
        const arrayBuffer = await response.arrayBuffer();

        console.log(arrayBuffer, 'one')

        // const buffers = await fetch(check?.data?.audios[0]?.file);
        // const arrayBuffer = await buffers.arrayBuffer();
        // let data = { name: check?.data?.audios?.title, buffer: arrayBuffer };

        // console.log(data, "BUFFERS")

        // const response = await fetch(check.data.remoteAudioUrl);
        // if (!response.ok) {
        //     throw new Error('Failed to fetch the audio file');
        // }
        // const buffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer);

        // return new NextResponse(buffers, {
        //     headers: {
        //         'Content-Type': 'audio/mpeg',
        //         'Content-Disposition': `attachment; filename="${check.data.audioName}.mp3"`,
        //     },
        // });
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

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