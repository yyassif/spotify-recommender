import clsx from 'clsx';
import { FC } from 'react';
import { Track } from '~/lib/spotify';
import TrackTile, { TrackTileMode } from './track-tile';

export enum TrackGridMode {
    Standard = 'standard',
    Compact = 'compact',
}

type TrackGridProps = {
    tracks: Array<Track>;
    selection: Array<string>;
    onTrackClick: (track: Track) => void;
    mode: TrackGridMode;
};

const TrackGrid: FC<TrackGridProps> = ({ tracks, onTrackClick, selection, mode }) => (
    <div
        className={clsx('max-w-screen-2xl', {
            'grid auto-rows-fr grid-cols-2 gap-2 px-2 mb-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7':
                mode === TrackGridMode.Standard,
            'grid auto-rows-fr grid-cols-5 gap-x-2 mx-2':
                mode === TrackGridMode.Compact,
        })}
    >
        {tracks.map((track) => (
            <TrackTile
                key={track.id}
                track={track}
                onTrackClick={onTrackClick}
                selected={selection.includes(track.id)}
                mode={
                    mode === TrackGridMode.Standard
                        ? TrackTileMode.Standard
                        : TrackTileMode.Compact
                }
            />
        ))}
    </div>
);

export default TrackGrid;
