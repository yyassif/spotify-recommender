import clsx from 'clsx';
import { FC } from 'react';
import ProgressiveImage from '~/components/progressive-image';
import { getAlbumImage } from '~/lib/image';
import { SpotifyImageSizes, Track } from '~/lib/spotify';

export enum TrackTileMode {
    Standard = 'standard',
    Compact = 'compact',
}

type TrackTileProps = {
    track: Track;
    onTrackClick: (track: Track) => void;
    selected?: boolean;
    mode: TrackTileMode;
};

const TrackTile: FC<TrackTileProps> = ({ track, onTrackClick, selected, mode }) => {
    return (
        <div
            key={track.id}
            onClick={() => onTrackClick(track)}
            className={clsx(
                'cursor-pointer rounded-md bg-opacity-10 shadow-md p-2 hover:bg-opacity-30',
                {
                    'bg-white': !selected,
                    'bg-opacity-70 text-black bg-indigo-500':
                        selected && mode === TrackTileMode.Standard
                }
            )}
        >
            <ProgressiveImage
                alt={track.album.name}
                src={getAlbumImage(track.album, SpotifyImageSizes.Medium)}
                loadingSrc={getAlbumImage(
                    track.album,
                    SpotifyImageSizes.Thumbnail
                )}
            />

            {mode === TrackTileMode.Standard && (
                <div className="mt-2">
                    <p className="font-bold">{track.name}</p>
                    <p className="font-light">{track.artists[0].name}</p>
                </div>
            )}
        </div>
    );
};

export default TrackTile;
