import { NextResponse } from "next/server";
import { checkToken } from "utils/token";

export const POST = async (request: Request) => {
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

        let progress = 0;

        const buffers: any = await Promise.all(check?.data?.audios?.map(async (audio: { file: string; title: string; duration: string; id: string; }) => {
            const response = await fetch(audio.file);
            const arrayBuffer = await response.arrayBuffer();
            progress += 1;
            console.log(`Progress: ${progress}/${check?.data?.audios?.length} files downloaded`);
            return { id: audio.id, title: audio.title, duration: audio.duration, buffer: arrayBuffer };
        }));

        console.log(buffers, 'one')

        // const buffers = await fetch(check?.data?.audios[0]?.file);
        // const arrayBuffer = await buffers.arrayBuffer();
        // let data = { name: check?.data?.audios?.title, buffer: arrayBuffer };

        // console.log(data, "BUFFERS")

        // const response = await fetch(check.data.remoteAudioUrl);
        // if (!response.ok) {
        //     throw new Error('Failed to fetch the audio file');
        // }
        // const buffer = await response.arrayBuffer();

        return NextResponse.json({ data: buffers, success: true }, { status: 200 });

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
