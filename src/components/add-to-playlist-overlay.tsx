"use client"
import { FC, useEffect, useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
    Playlist,
    Track,
    addTrackToPlaylist,
    getUserPlaylists,
} from '~/lib/spotify';
import Overlay from './overlay';

type AddToPlaylistOverlayProps = {
    userId: string;
    track: Track;
    onClose: () => void;
};

const AddToPlaylistOverlay: FC<AddToPlaylistOverlayProps> = ({ userId, track, onClose }) => {
    const [playlists, setPlayLists] = useState<Array<Playlist>>([]);
    useEffect(() => {
        getUserPlaylists(userId).then((playlists) => setPlayLists(playlists));
    }, [userId]);

    return (
        <Overlay
            closeButtonText="Cancel"
            onClose={onClose}
            title="Select a playlist:"
        >
            <ScrollArea className="space-y-2 px-2 flex flex-col my-2 h-full">
                {playlists.map((playlist) => (
                    <button
                        className="bg-white bg-opacity-10 p-4 cursor-pointer shadow-md rounded-lg text-left hover:bg-opacity-30 active:blur-sm w-full my-1"
                        key={playlist.id}
                        onClick={() => {
                            addTrackToPlaylist(track.id, playlist.id).then(() =>
                                onClose()
                            );
                        }}
                    >
                        {playlist.name}
                    </button>
                ))}
            </ScrollArea>
        </Overlay>
    );
};

export default AddToPlaylistOverlay;
