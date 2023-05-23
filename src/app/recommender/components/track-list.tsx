import { FC } from 'react';
import Button from '~/components/button';
import { Icons } from "~/components/icons";
import { getAlbumImage } from '~/lib/image';
import { SpotifyImageSizes, Track } from '~/lib/spotify';

type TrackListProps = {
    tracks: Array<Track>;
    currentPreviewTrack?: Track;
    selection: Array<string>;
    onAddToPlaylist: (track: Track) => void;
    onPlay: (track: Track) => void;
    onStop: () => void;
};

const TrackList: FC<TrackListProps> = ({
    tracks,
    onAddToPlaylist,
    onPlay,
    onStop,
    currentPreviewTrack,
}) => (
    <div className="grid grid-cols-1 auto-rows-fr space-y-4 px-2 w-full max-w-screen-2xl md:space-y-0 md:auto-rows-fr md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-4 xl:grid-cols-4">
        {tracks.map((track) => (
            <div
                key={track.id}
                className="flex items-center shadow-md justify-between bg-white bg-opacity-10 rounded-md hover:bg-opacity-30 px-2"
            >
                <a
                    className="flex space-x-4 items-center"
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        className="w-16 h-16 aspect-square rounded-sm"
                        src={getAlbumImage(
                            track.album,
                            SpotifyImageSizes.Thumbnail
                        )}
                        alt={track.name}
                    />
                    <div className="flex justify-center flex-col py-2">
                        <p className="font-bold max-h-12 overflow-hidden">
                            {track.name}
                        </p>
                        <p className="font-light">
                            {track.artists[0].name}
                        </p>
                    </div>
                </a>
                <div className="flex space-x-2 mx-2">
                    {(!currentPreviewTrack ||
                        currentPreviewTrack.id !== track.id) && (
                        <Button className="px-2" onClick={() => onPlay(track)}>
                            <Icons.play />
                        </Button>
                    )}
                    {currentPreviewTrack?.id === track.id && (
                        <Button className="px-2" onClick={() => onStop()}>
                            <Icons.stop />
                        </Button>
                    )}
                    <Button className="px-2" onClick={() => onAddToPlaylist(track)}>
                        <Icons.add />
                    </Button>
                </div>
            </div>
        ))}
    </div>
);

export default TrackList;
