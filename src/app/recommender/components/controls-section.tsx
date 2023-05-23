"use client"
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import Button from '~/components/button';
import { Track } from '~/lib/spotify';
import { JourneySteps, isStepBeforeChoosing } from '~/lib/util';

import Loading from '~/components/loading-animation';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import SelectedItems from './selected-items';

type ControlsSectionProps = {
    setMaxInput: (n: number) => void;
    setMaxOutput: (n: number) => void;
    getTopTracks: () => void;
    reset: () => void;
    login: () => void;
    onGetRecommendations: () => void;
    showSelectedItems: boolean;
    toggleTrackSelection: (track: Track) => void;
    selectedTracks: Track[];
    currentStep: JourneySteps;
};

const ControlsSection: FC<ControlsSectionProps> = ({
    setMaxInput,
    setMaxOutput,
    getTopTracks,
    reset,
    onGetRecommendations,
    showSelectedItems,
    toggleTrackSelection,
    selectedTracks,
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
                'max-w-screen-2xl flex w-full flex-col py-4 space-y-2 md:space-y-1 md:space-x-2',
                {
                    'h-[90vh] justify-between md:justify-between':
                        isStepBeforeChoosing(currentStep),
                }
            )}
        >
            <div
                className={clsx('flex flex-col space-y-2 items-center', {
                    'space-y-4 md:max-w-[60vw]':
                        isStepBeforeChoosing(currentStep),
                })}
            >
                {isStepBeforeChoosing(currentStep) && (
                    <div>
                        <h3 className="text-3xl font-extrabold sm:text-3xl md:text-5xl lg:text-6xl">Spotify Recommendation Using Content-Based Filtering</h3>
                        <div className="text-lg text-muted-foreground sm:text-xl mt-4">
                            Get some recommendatons based on the music similarity vectors.
                            Select up to 20 of randomly generated tracks.
                            Add songs you like to your playlists and enjoy!
                        </div>
                    </div>
                )}
                <div className='flex space-x-2 flex-col space-y-6 w-full md:w-[40vw] lg:w-[30vw] xl:w-[20vw]'>
                {currentStep === JourneySteps.Start && (
                    <div className='w-full'>
                        <div className='mt-2'>
                            <Label htmlFor="max-inputs">Max Inputs for recommendations (1-20):</Label>
                            <Input min={1} max={20} type="number" id="max-inputs" placeholder="Max inputs for recommendations" onChange={(e) => setMaxInput(parseInt(e.target.value))} />
                        </div>
                        <div className='mt-2'>
                            <Label htmlFor="max-outputs">Max Outputs for recommendations (1-100):</Label>
                            <Input min={1} max={100} type="number" id="max-outputs" placeholder="Max outputs for recommendations" onChange={(e) => setMaxOutput(parseInt(e.target.value))} />
                        </div>
                    </div>
                )}
                </div> 
                <div
                    className={clsx('w-full flex space-x-2', {
                        'flex-col space-y-6 space-x-0 w-full md:w-[40vw] lg:w-[30vw] xl:w-[20vw]':
                        isStepBeforeChoosing(currentStep),
                    })}
                >
                    {currentStep === JourneySteps.Loading && (
                        <div className="flex space-y-5"><Loading /></div>
                    )}
                    {currentStep === JourneySteps.Login && (
                        <Button onClick={() => login()}>Login to Spotify</Button>
                    )}
                    {currentStep === JourneySteps.Start && (
                        <Button onClick={() => { getTopTracks() }}>Generate random tracks</Button>
                    )}

                    <div className='w-full grid auto-rows-fr grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-2 items-center'>
                        {currentStep === JourneySteps.ChooseTracks && (
                            <Button onClick={() => reset()}>Restart</Button>
                        )}
                        {currentStep === JourneySteps.ChooseTracks && (
                            <Button onClick={() => getTopTracks()}>Shuffle</Button>
                        )}

                        {currentStep === JourneySteps.ShowRecommendations && (
                            <Button onClick={() => reset()}>Get New Recommendations</Button>
                        )}
                    </div>
                </div>
            </div>
            
            {showSelectedItems && (
            <div className="relative w-full pt-2">
                <SelectedItems
                    selectedTracks={selectedTracks}
                    toggleTrackSelection={toggleTrackSelection}
                    onGetRecommendations={onGetRecommendations}
                />
            </div>
            )}
        </div>
    );
};

export default ControlsSection;
