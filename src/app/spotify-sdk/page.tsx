"use client"
import { useEffect, useState } from 'react';
import AddToPlaylistOverlay from '~/components/add-to-playlist-overlay';
import Button from '~/components/button';
import SpotifyPlayer from '~/components/spotify-player';
import {
    Artist,
    ItemType,
    TimeRange,
    Track,
    getMusicGenres,
    getTopItems,
    getTrackRecommendations,
} from '~/lib/spotify';
import { User, getCurrentUser, login } from '~/lib/spotify-auth';
import { JourneySteps, filterListByIds, scrollToTop } from '~/lib/util';
import ArtistGrid from './components/artist-grid';
import ControlsSection from './components/controls-section';
import GenreGrid from './components/genre-grid';
import TrackGrid, { TrackGridMode } from './components/track-grid';
import TrackList from './components/track-list';

type SelectionJourneyStep =
    | JourneySteps.ChooseArtists
    | JourneySteps.ChooseGenres
    | JourneySteps.ChooseTracks;

type HasNext = Record<SelectionJourneyStep, boolean>;

const defaultHasNext: HasNext = {
    [JourneySteps.ChooseArtists]: false,
    [JourneySteps.ChooseGenres]: false,
    [JourneySteps.ChooseTracks]: false,
};

export default function SpotifySDKPage() {
    const [journeyStep, setJourneyStep] = useState<JourneySteps>(
        JourneySteps.Loading
    );
    const [user, setCurrentUser] = useState<User | undefined>(undefined);
    const [topTracks, setTopTracks] = useState<Array<Track>>([]);
    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);
    const [genres, setGenres] = useState<Array<string>>([]);
    const [maxInput, setMaxInput] = useState<number>(5);
    const [maxOutput, setMaxOutput] = useState<number>(100);
    const [hasNextData, setHasNextData] = useState<HasNext>({
        ...defaultHasNext,
    });

    const [recommendedTracks, setRecommendedTracks] = useState<Array<Track>>(
        []
    );

    const [selectedTrackIds, setSelectedTrackIds] = useState<Array<string>>([]);
    const [selectedArtistIs, setSelectedArtistIs] = useState<Array<string>>([]);
    const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);

    const [hasRecommendations, toggleHasRecommendations] =
        useState<boolean>(false);

    const [currentPreview, setCurrentPreview] = useState<Track | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ShortTerm);
    const [trackToAdd, setTrackToAdd] = useState<Track | undefined>();

    const getSelectionCount = (): number => {
        return (
            selectedTrackIds.length +
            selectedArtistIs.length +
            selectedGenres.length
        );
    };

    const getTopTracks = async (page = 0) => {
        const { items: tracks, hasNext } = await getTopItems<Track>(
            ItemType.Tracks,
            timeRange,
            page
        );
        setTopTracks(page === 0 ? tracks : [...topTracks, ...tracks]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page);
        setJourneyStep(JourneySteps.ChooseTracks);
        setHasNextData({
            ...hasNextData,
            [JourneySteps.ChooseTracks]: hasNext,
        });
    };

    const getTopArtists = async (page = 0) => {
        const { items: artists, hasNext } = await getTopItems<Artist>(
            ItemType.Artists,
            timeRange,
            page
        );
        setTopArtists(page === 0 ? artists : [...topArtists, ...artists]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setCurrentPage(page);
        setJourneyStep(JourneySteps.ChooseArtists);
        setHasNextData({
            ...hasNextData,
            [JourneySteps.ChooseArtists]: hasNext,
        });
    };

    const getGenres = async () => {
        const genres = await getMusicGenres();
        setGenres(genres);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setJourneyStep(JourneySteps.ChooseGenres);
        setHasNextData({ ...hasNextData, [JourneySteps.ChooseGenres]: false });
    };

    const loadMore = () => {
        switch (journeyStep) {
            case JourneySteps.ChooseTracks:
                getTopTracks(currentPage + 1);
                break;
            case JourneySteps.ChooseArtists:
                getTopArtists(currentPage + 1);
                break;
            default:
                break;
        }
    };

    const getRecommendations = async (
        trackIds: Array<string>,
        artistIds: Array<string>,
        genreIds: Array<string>
    ) => {
        const tracks = await getTrackRecommendations(
            trackIds,
            artistIds,
            genreIds
        );
        setRecommendedTracks(tracks);
        toggleHasRecommendations(true);
        setJourneyStep(JourneySteps.ShowRecommendations);
        scrollToTop();
    };

    const toggleSelection = (
        selection: Array<string>,
        id: string,
        selectedCount: number,
        setter: (selection: Array<string>) => void
    ) => {
        if (selection.includes(id)) {
            setter(selection.filter((entry) => entry !== id));
        } else {
            if (selectedCount < maxInput) {
                setter([...selection, id]);
            } else {
                // toast.error(`You can only select ${maxInput} items`);
            }
        }
    };

    const toggleTrackSelection = (track: Track) => {
        toggleSelection(
            selectedTrackIds,
            track.id,
            getSelectionCount(),
            setSelectedTrackIds
        );
    };

    const toggleArtistSelection = (artist: Artist) => {
        toggleSelection(
            selectedArtistIs,
            artist.id,
            getSelectionCount(),
            setSelectedArtistIs
        );
    };

    const toggleGenreSelection = (genre: string) => {
        toggleSelection(
            selectedGenres,
            genre,
            getSelectionCount(),
            setSelectedGenres
        );
    };

    const playPreview = (track: Track) => {
        setCurrentPreview(track);
    };

    const addToPlaylist = (track: Track) => {
        setTrackToAdd(track);
    };

    const reset = () => {
        setJourneyStep(JourneySteps.Start);
        setSelectedArtistIs([]);
        setSelectedTrackIds([]);
        setSelectedGenres([]);
        setTopArtists([]);
        setTopTracks([]);
        setGenres([]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setHasNextData({ ...defaultHasNext });
        setCurrentPreview(undefined);
    };

    const loginHandler = async () => {
        await login();
        const user = await getCurrentUser();
        setCurrentUser(user);
    };

    useEffect(() => {
        getCurrentUser().then((user) => {
            if (user) {
                setCurrentUser(user);
                setJourneyStep(JourneySteps.Start);
            } else {
                setJourneyStep(JourneySteps.Login);
            }
        });
    }, []);

    return (
        <div className="min-h-screen flex items-center flex-col">
            <ControlsSection
                currentStep={journeyStep}
                setMaxInput={setMaxInput}
                setMaxOutput={setMaxOutput}
                getTopArtists={getTopArtists}
                getTopTracks={getTopTracks}
                getTopGenres={getGenres}
                reset={reset}
                login={loginHandler}
                onGetRecommendations={() => {
                    getRecommendations(
                        selectedTrackIds,
                        selectedArtistIs,
                        selectedGenres
                    );
                }}
                selectedArtists={filterListByIds<Artist>(
                    topArtists,
                    selectedArtistIs
                )}
                selectedTracks={filterListByIds<Track>(
                    topTracks,
                    selectedTrackIds
                )}
                selectedGenres={selectedGenres}
                setTimeRange={setTimeRange}
                timeRange={timeRange}
                toggleArtistSelection={toggleArtistSelection}
                toggleGenreSelection={toggleGenreSelection}
                toggleTrackSelection={toggleTrackSelection}
                showSelectedItems={
                    !hasRecommendations && getSelectionCount() > 0
                }
            />

            {journeyStep === JourneySteps.ChooseTracks && (
                <TrackGrid
                    tracks={topTracks}
                    selection={selectedTrackIds}
                    onTrackClick={toggleTrackSelection}
                    mode={
                        hasRecommendations
                            ? TrackGridMode.Compact
                            : TrackGridMode.Standard
                    }
                />
            )}
            {journeyStep === JourneySteps.ChooseArtists && (
                <ArtistGrid
                    artists={topArtists}
                    selectedArtistIs={selectedArtistIs}
                    toggleArtistSelection={toggleArtistSelection}
                />
            )}
            {journeyStep === JourneySteps.ChooseGenres && (
                <GenreGrid
                    genres={genres}
                    toggleGenreSelection={toggleGenreSelection}
                    selectedGenres={selectedGenres}
                />
            )}
            {hasNextData[journeyStep as SelectionJourneyStep] && (
                <Button className="mb-2" onClick={loadMore}>
                    Load More
                </Button>
            )}
            {hasRecommendations && (
                <div className="flex flex-wrap justify-center">
                    <TrackList
                        tracks={recommendedTracks}
                        currentPreviewTrack={currentPreview}
                        selection={[]}
                        onAddToPlaylist={addToPlaylist}
                        onPlay={playPreview}
                        onStop={() => setCurrentPreview(undefined)}
                    />
                </div>
            )}
            <SpotifyPlayer
                track={currentPreview}
                onAddToPlaylist={addToPlaylist}
            />
            {user && trackToAdd && (
                <AddToPlaylistOverlay
                    userId={user.id}
                    track={trackToAdd}
                    onClose={() => setTrackToAdd(undefined)}
                />
            )}
        </div>
    );
};

