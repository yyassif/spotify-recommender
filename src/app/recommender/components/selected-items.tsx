"use client"
import { FC } from 'react';
import { SpotifyImageSizes, Track } from '~/lib/spotify';

import Button from '~/components/button';
import { Icons } from '~/components/icons';
import { getAlbumImage } from '~/lib/image';

type SelectedItemsProps = {
    selectedTracks: Array<Track>;
    toggleTrackSelection: (track: Track) => void;
    onGetRecommendations: () => void;
};

const SelectedItems: FC<SelectedItemsProps> = ({
    selectedTracks,
    toggleTrackSelection,
    onGetRecommendations,
}) => (
    <div>
        <div className="w-full grid auto-rows-fr grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 py-2">
            {selectedTracks.map((track) => {
                return (
                    <div
                        key={track.id}
                        onClick={() => toggleTrackSelection(track)}
                        className="bg-white bg-opacity-10 rounded-md p-2 flex items-center space-x-2 justify-between"
                    >
                        <div>
                            <img
                                src={getAlbumImage(
                                    track.album,
                                    SpotifyImageSizes.Thumbnail
                                )}
                                className="min-w-min w-10 h-10 aspect-square rounded-sm"
                                alt={track?.name}
                            />
                        </div>
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                                {track.name}
                            </span>
                            <span className="font-light text-ellipsis overflow-hidden whitespace-nowrap">
                                {track.artists[0].name}
                            </span>
                        </div>
                        <Button className="px-2">
                            <Icons.remove />
                        </Button>
                    </div>
                );
            })}
            
        </div>
        <div className="max-w-full py-2">
            <Button
                onClick={onGetRecommendations}
                disabled={selectedTracks.length === 0}
            >Get Recommendatons</Button>
        </div>
    </div>
);

export default SelectedItems;
