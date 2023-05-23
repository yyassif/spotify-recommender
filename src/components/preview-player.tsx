"use client";
import { FC, useEffect, useRef } from 'react';
import { Track } from '~/lib/spotify';

type PreviewPlayerProps = {
    track?: Track;
};

const PreviewPlayer: FC<PreviewPlayerProps> = ({ track }) => {
    const audioPlayer = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioPlayer.current) {
            if (track?.preview_url) {
                audioPlayer.current.play();
            } else {
                audioPlayer.current.pause();
            }
        }
    }, [track]);

    useEffect(() => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = 0.25;
        }
    }, [audioPlayer]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white flex flex-col border-t-2 border-green-700">
            {track && (
                <span className="px-4 py-2">
                    {track?.name} - {track?.artists[0].name}
                </span>
            )}
            <audio
                className="w-full"
                ref={audioPlayer}
                controls
                src={track?.preview_url}
            ></audio>
        </div>
    );
};

export default PreviewPlayer;
