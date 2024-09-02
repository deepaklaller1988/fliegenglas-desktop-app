import Link from 'next/link'
import React from 'react'

export default function PrivacyPolicyLink() {
    return (
        <div className="w-full text-center mb-2">
            <Link
                prefetch={true}
                href="/information/privacy"
                className="bg-white/0 rounded-md text-white p-2 px-3 text-[14px] inline-block m-auto underline"
            >
                Datenschutzerklärung
            </Link>
        </div>
    )
}
