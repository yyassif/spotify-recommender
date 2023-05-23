'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '~/components/loading-animation';
import { processLogin } from '~/lib/spotify-auth';

export default function Callback() {
    const router = useRouter()
    useEffect(() => {
        processLogin(new URLSearchParams(location.search)).then(() => router.push('/spotify-sdk'));
    }, []);

    return <Loading />;
}