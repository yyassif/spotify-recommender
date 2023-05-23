"use client"
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import Button from '~/components/button';
import { Artist, TimeRange, Track } from '~/lib/spotify';
import { JourneySteps, isStepBeforeChoosing } from '~/lib/util';

import Loading from '~/components/loading-animation';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/ui/select";
import SelectedItems from './selected-items';

type ControlsSectionProps = {
    timeRange: TimeRange;
    setTimeRange: (timeRange: TimeRange) => void;
    setMaxInput: (n: number) => void;
    setMaxOutput: (n: number) => void;
    getTopTracks: () => void;
    getTopGenres: () => void;
    getTopArtists: () => void;
    reset: () => void;
    login: () => void;
    onGetRecommendations: () => void;
    showSelectedItems: boolean;
    toggleArtistSelection: (artist: Artist) => void;
    toggleTrackSelection: (track: Track) => void;
    toggleGenreSelection: (genre: string) => void;
    selectedArtists: Artist[];
    selectedTracks: Track[];
    selectedGenres: string[];
    currentStep: JourneySteps;
};

const ControlsSection: FC<ControlsSectionProps> = ({
    setTimeRange,
    setMaxInput,
    setMaxOutput,
    timeRange,
    getTopTracks,
    getTopArtists,
    getTopGenres,
    reset,
    onGetRecommendations,
    showSelectedItems,
    toggleArtistSelection,
    toggleGenreSelection,
    toggleTrackSelection,
    selectedArtists,
    selectedTracks,
    selectedGenres,
    currentStep,
    login,
}) => {
    const containerRef = useRef(null);
    const [isSticked, toggleIsStickied] = useState<boolean>(false);

    const intersectCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                toggleIsStickied(false);
            } else {
                toggleIsStickied(true);
            }
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(intersectCallback, {
            rootMargin: '-1px 0px 0px 0px',
            threshold: [1],
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            observer.disconnect();
        };
    }, [containerRef]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                'max-w-screen-2xl flex w-full flex-col md:justify-center items-center py-4 space-y-2 md:space-y-1 md:space-x-2',
                {
                    'py-6 h-[90vh] justify-between md:justify-between':
                        isStepBeforeChoosing(currentStep),
                }
            )}
        >
            <div
                className={clsx('flex flex-col space-y-2 items-center', {
                    'space-y-4 md:max-w-[60vw] px-8':
                        isStepBeforeChoosing(currentStep),
                })}
            >
                {isStepBeforeChoosing(currentStep) && (
                    <div>
                        <h3 className="text-3xl font-extrabold sm:text-3xl md:text-5xl lg:text-6xl">Spotify SDK Recommendation</h3>
                        <div className="text-lg text-muted-foreground sm:text-xl text-center mt-4">
                            Get some recommendatons based on your past musicial
                            habits. Select you desired time range and select up to 5
                            of your past artists or tracks. Add songs you like to
                            your playlists and enjoy!
                        </div>
                    </div>
                )}
                <div className='flex space-x-2 flex-col space-y-6 w-full md:w-[40vw] lg:w-[30vw] xl:w-[20vw]'>
                {currentStep === JourneySteps.Start && (
                    <div className='w-full'>
                        <Label>Time Range :</Label>
                        <Select name="time-range" onValueChange={(e) => setTimeRange(e as TimeRange)} defaultValue={timeRange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Time Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={TimeRange.LongTerm}>Multipe Years</SelectItem>
                                    <SelectItem value={TimeRange.MediumTerm}>Last 6 months</SelectItem>
                                    <SelectItem value={TimeRange.ShortTerm}>Last 4 weeks</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className='mt-2'>
                            <Label htmlFor="max-inputs">Max Inputs for recommendations :</Label>
                            <Input type="number" id="max-inputs" placeholder="Max inputs for recommendations" onChange={(e) => setMaxInput(parseInt(e.target.value))} />
                        </div>
                        <div className='mt-2'>
                            <Label htmlFor="max-outputs">Max Outputs for recommendations :</Label>
                            <Input type="number" id="max-outputs" placeholder="Max outputs for recommendations" onChange={(e) => setMaxOutput(parseInt(e.target.value))} />
                        </div>
                        
                    </div>
                )}
                </div> 
                <div
                    className={clsx('flex space-x-2', {
                        'flex-col space-y-6 space-x-0 w-full md:w-[40vw] lg:w-[30vw] xl:w-[20vw]':
                        isStepBeforeChoosing(currentStep),
                    })}
                >
                    {currentStep === JourneySteps.Loading && (
                        <div className="flex space-y-5">
                            <Loading />
                        </div>
                    )}
                    {currentStep === JourneySteps.Login && (
                        <Button onClick={() => login()}>
                            Login to Spotify
                        </Button>
                    )}

                    
                    {currentStep === JourneySteps.Start && (
                        <>
                            <Button onClick={() => {
                                getTopTracks()
                            }}>
                                Choose your tracks
                            </Button>
                        </>
                    )}
                    {currentStep === JourneySteps.ChooseTracks && (
                        <>
                            <Button onClick={() => reset()}>Restart</Button>
                            <Button onClick={() => getTopGenres()}>Choose your genres</Button>
                            <Button onClick={() => getTopArtists()}>Choose your artists</Button>
                        </>
                    )}
                    {currentStep === JourneySteps.ChooseGenres && (
                        <>
                            <Button onClick={() => reset()}>Restart</Button>
                            <Button onClick={() => getTopArtists()}>Choose your artists</Button>
                            <Button onClick={() => getTopTracks()}>Choose your tracks</Button>
                        </>
                    )}
                    {currentStep === JourneySteps.ChooseArtists && (
                        <>
                            <Button onClick={() => reset()}>Restart</Button>
                            <Button onClick={() => getTopGenres()}>Choose your genres</Button>
                            <Button onClick={() => getTopTracks()}>Choose your tracks</Button>
                        </>
                    )}

                    {currentStep === JourneySteps.ShowRecommendations && (
                        <Button onClick={() => reset()}>
                            Get New Recommendations
                        </Button>
                    )}
                </div>
            </div>
            
            {showSelectedItems && (
            <div className="relative w-full pt-2">
                <SelectedItems
                    selectedTracks={selectedTracks}
                    selectedArtists={selectedArtists}
                    selectedGenres={selectedGenres}
                    toggleArtistSelection={toggleArtistSelection}
                    toggleTrackSelection={toggleTrackSelection}
                    toggleGenreSelection={toggleGenreSelection}
                    onGetRecommendations={onGetRecommendations}
                />
            </div>
            )}
        </div>
    );
};

export default ControlsSection;
