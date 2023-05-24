"use client"
import { useEffect, useState } from 'react';
import AddToPlaylistOverlay from '~/components/add-to-playlist-overlay';
import SpotifyPlayer from '~/components/spotify-player';
import {
    Track,
    getModelTrackRecommendations,
    getTrackItemsByIds
} from '~/lib/spotify';
import { User, getCurrentUser, login } from '~/lib/spotify-auth';
import { JourneySteps, filterListByIds, scrollToTop } from '~/lib/util';
import ControlsSection from './components/controls-section';
import TrackGrid, { TrackGridMode } from './components/track-grid';
import TrackList from './components/track-list';

type SelectionJourneyStep = JourneySteps.ChooseTracks;

type HasNext = Record<SelectionJourneyStep, boolean>;

const defaultHasNext: HasNext = {
    [JourneySteps.ChooseTracks]: false,
};

export default function RecommenderPage() {
    const [journeyStep, setJourneyStep] = useState<JourneySteps>(
        JourneySteps.Loading
    );
    const [user, setCurrentUser] = useState<User | undefined>(undefined);
    const [topTracks, setTopTracks] = useState<Array<Track>>([]);
    const [maxInput, setMaxInput] = useState<number>(5);
    const [maxOutput, setMaxOutput] = useState<number>(100);
    const [hasNextData, setHasNextData] = useState<HasNext>({...defaultHasNext,});

    const [recommendedTracks, setRecommendedTracks] = useState<Array<Track>>([]);

    const [selectedTrackIds, setSelectedTrackIds] = useState<Array<string>>([]);
    const [hasRecommendations, toggleHasRecommendations] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<Track | undefined>();
    const [trackToAdd, setTrackToAdd] = useState<Track | undefined>();

    const getTopTracks = async () => {
        const { items: tracks, hasNext } = await getTrackItemsByIds(maxInput);
        setTopTracks(tracks);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setJourneyStep(JourneySteps.ChooseTracks);
        setHasNextData({
            ...hasNextData,
            [JourneySteps.ChooseTracks]: hasNext,
        });
    };

    const getRecommendations = async (trackIds: Array<string>) => {
        const tracks = await getModelTrackRecommendations(trackIds, maxOutput);
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
                // TODO: Add a message component
                // toast.error('You can only select 5 items.');
            }
        }
    };

    const toggleTrackSelection = (track: Track) => {
        toggleSelection(
            selectedTrackIds,
            track.id,
            selectedTrackIds.length,
            setSelectedTrackIds
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
        setSelectedTrackIds([]);
        setTopTracks([]);
        toggleHasRecommendations(false);
        setRecommendedTracks([]);
        setHasNextData({ ...defaultHasNext });
        setMaxInput(5);
        setMaxOutput(100);
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
        <div className="min-h-screen flex items-center flex-col w-full">
            <ControlsSection
                maxInput={maxInput}
                maxOutput={maxOutput}
                currentStep={journeyStep}
                setMaxInput={setMaxInput}
                setMaxOutput={setMaxOutput}
                getTopTracks={getTopTracks}
                reset={reset}
                login={loginHandler}
                onGetRecommendations={() => {
                    console.log(selectedTrackIds)
                    getRecommendations(
                        selectedTrackIds
                    );
                }}
                selectedTracks={filterListByIds<Track>(
                    topTracks,
                    selectedTrackIds
                )}
                toggleTrackSelection={toggleTrackSelection}
                showSelectedItems={
                    !hasRecommendations && selectedTrackIds.length > 0
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
