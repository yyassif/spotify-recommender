"use client"
import { FC, useEffect, useState } from 'react';
import Button from '~/components/button';
import { Icons } from "~/components/icons";
import { Track, playTrack } from '~/lib/spotify';
import { getAccessToken } from '~/lib/spotify-auth';

type SpotifyPlayerProps = {
    track?: Track;
    onAddToPlaylist: (track: Track) => void;
};

export interface globalThis {
    onSpotifyWebPlaybackSDKReady?: any;
    Spotify?: any
}

const SpotifyPlayer: FC<SpotifyPlayerProps> = ({ track, onAddToPlaylist }) => {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [player, setPlayer] = useState<any | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        getAccessToken().then((accessToken) => {
            if (!accessToken) {
                return;
            }
            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = accessToken;
                const player = new window.Spotify.Player({
                    name: 'Spotify Recommender App',
                    getOAuthToken: (cb: (token: string) => void) => cb(token),
                    volume: 0.5,
                });

                player.addListener(
                    'ready',
                    ({ device_id }: { device_id: string }) => {
                        setDeviceId(device_id);
                        console.log('Ready with Device ID', device_id);
                    }
                );

                player.addListener(
                    'not_ready',
                    ({ device_id }: { device_id: string }) => {
                        console.log('Device ID has gone offline', device_id);
                    }
                );

                player.connect();

                setPlayer(player);
            };
        });
    }, []);

    useEffect(() => {
        if (track) {
            if (deviceId) {
                playTrack(deviceId, track);
            }
        } else {
            if (player) {
                player.pause();
            }
        }
    }, [track, deviceId, player]);

    if (!track) {
        return null;
    }

    return (
        <div className='container items-center w-full fixed bottom-0 left-0 right-0 mx-auto px-4'>
            <div className="bg-indigo-500 text-white border-t-2 border-white mx-4">
                <div className="flex items-center justify-between">
                    <img
                        className="w-20 h-20"
                        src={track.album.images[0].url}
                        alt={track.name}
                    />
                    <div className="flex flex-col">
                        <span className="font-bold">{track?.name}</span>
                        <span className="font-light">{track?.artists[0].name}</span>
                    </div>
                    <div className="flex mr-2 space-x-2">
                        <Button className="px-2"
                            onClick={() => {
                                console.log('stopping', player);
                                player?.pause();
                            }}
                        >
                            <Icons.stop />
                        </Button>
                        <Button className="px-2" onClick={() => onAddToPlaylist(track)}>
                            <Icons.add />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotifyPlayer;
