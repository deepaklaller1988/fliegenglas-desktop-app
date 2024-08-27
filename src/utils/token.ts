import * as jose from 'jose';

export async function generateToken(payload: any) {
    try {
        const jwtToken = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN_EXPIRY as string)
            .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN_SECRET));

        return jwtToken;
    } catch (e) {
        console.log(e)
    }
}

export async function checkToken(token: any) {
    try {
        const { payload: jwtData } = await jose.jwtVerify(
            token, new TextEncoder().encode(process.env.NEXT_PUBLIC_DOWNLOAD_TOKEN_SECRET)
        );
        return { data: jwtData, success: true };
    } catch (error: unknown) {
        // Asserting that error is of type Error
        if (typeof error === 'object' && error !== null && 'name' in error) {
            const errorName = (error as Error).name;
            if (errorName.includes('JWTExpired')) {
                return { data: "JWTExpired", success: false };
            } else {
                return { data: errorName, success: false };
            }
        } else {
            return { data: error, success: false };
        }
    }
}