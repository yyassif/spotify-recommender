import clsx from 'clsx';
import { FC } from 'react';
import ProgressiveImage from '~/components/progressive-image';
import { getSpotifyImage } from '~/lib/image';
import { Artist, SpotifyImageSizes } from '~/lib/spotify';

type Props = {
    artists: Array<Artist>;
    selectedArtistIs: Array<string>;
    toggleArtistSelection: (artist: Artist) => void;
};

const ArtistGrid: FC<Props> = ({
    artists,
    selectedArtistIs,
    toggleArtistSelection,
}) => (
    <div className="grid auto-rows-fr grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 w-full max-w-screen-2xl gap-2 px-2 mb-2">
        {artists.map((artist) => {
            const included = selectedArtistIs.includes(artist.id);
            return (
                <div
                    key={artist.id}
                    className={clsx(
                        'cursor-pointer rounded-md bg-opacity-10 shadow-md p-2 hover:bg-opacity-30',
                        {
                            'bg-white': !included,
                            'bg-opacity-70 text-black bg-fuchsia-500': included,
                        }
                    )}
                    onClick={() => toggleArtistSelection(artist)}
                >
                    <ProgressiveImage
                        alt={artist.name}
                        src={getSpotifyImage(
                            artist.images,
                            SpotifyImageSizes.Medium
                        )}
                        loadingSrc={getSpotifyImage(
                            artist.images,
                            SpotifyImageSizes.Thumbnail
                        )}
                    />
                    <p className="px-2 mt-2">{artist.name}</p>
                </div>
            )
        })}
    </div>
);

export default ArtistGrid;
