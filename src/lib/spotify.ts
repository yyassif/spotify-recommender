import axios from 'axios';
import { fetchWithToken } from './spotify-auth';

const GET_CONFIG = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
    }
};

const POST_CONFIG = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST"
    }
};


const fastapi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FASTAPI_URL,
});

fastapi.defaults.headers.post['Content-Type'] = 'application/json';
fastapi.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
fastapi.defaults.headers.post['Access-Control-Allow-Methods'] = 'GET,POST';

export enum ItemType {
    Artists = 'artists',
    Tracks = 'tracks',
}

export enum TimeRange {
    LongTerm = 'long_term',
    MediumTerm = 'medium_term',
    ShortTerm = 'short_term',
}

export enum SpotifyImageSizes {
    Thumbnail = 64,
    Small = 300,
    Medium = 640,
}

export type SpotifyImage = {
    height: SpotifyImageSizes;
    width: SpotifyImageSizes;
    url: string;
};

export type Album = {
    uri: string;
    name: string;
    images: Array<SpotifyImage>;
};

export type TrackArtist = {
    id: string;
    name: string;
    uri: string;
};

export type Track = {
    id: string;
    uri: string;
    name: string;
    preview_url: string;
    album: Album;
    artists: Array<TrackArtist>;
    external_urls: { spotify: string };
};

export type Artist = {
    id: string;
    uri: string;
    name: string;
    genres: Array<string>;
    images: Array<SpotifyImage>;
};

export type Playlist = {
    id: string;
    uri: string;
    name: string;
};

const getData = async (
    input: RequestInfo,
    init?: RequestInit | undefined
): Promise<any> => {
    // TODO: handle errors and messaging
    try {
        const response = await fetchWithToken(input, init);
        if (!response.ok) {
            console.log('Error', response.statusText);
            return {};
        } else {
            return await response.json();
        }
    } catch (error) {
        console.log('Error', error);
        return {};
    }
};

export const getTopItems = async <T>(
    type: ItemType,
    timeRange: TimeRange,
    page = 0
): Promise<{ items: Array<T>; hasNext: boolean }> => {
    const limit = 40;
    const offset = page * limit;
    const data = await getData(
        `https://api.spotify.com/v1/me/top/${type}?limit=${limit}&time_range=${timeRange}&offset=${offset}`
    );

    return {
        items: data.items as Array<T>,
        hasNext: data.next !== null,
    };
};

export const getTrackRecommendations = async (
    trackIds: Array<string>,
    artistIds: Array<string>,
    genreIds: Array<string>
): Promise<Array<Track>> => {
    const limit = 100;
    const seed_tracks = trackIds.join(',');
    const artists_tracks = artistIds.slice(0, 5 - trackIds.length).join(',');
    const seed_genres = genreIds.slice(0, 5 - (trackIds.length + artistIds.length)).join(',');

    const data = await getData(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${artists_tracks}&seed_genres=${seed_genres}&limit=${limit}`
    );

    return data.tracks as Array<Track>;
};

export const getMusicGenres = async (): Promise<Array<string>> => {
    const data = await getData(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds'
    );

    return data.genres as Array<string>;
};

export const getUserPlaylists = async (
    userId: string
): Promise<Array<Playlist>> => {
    const data = await getData(`https://api.spotify.com/v1/users/${userId}/playlists?limit=50`);

    return data.items as Array<Playlist>;
};

export const addTrackToPlaylist = async (
    trackId: string,
    playlistId: string
) => {
    const data = await getData(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`,
        {
            method: 'POST',
        }
    );
};

export const playTrack = async (
    deviceId: string,
    track: Track
): Promise<Response> => {
    return fetchWithToken(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
            method: 'PUT',
            body: JSON.stringify({ uris: [track.uri] }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
};


// Recommender Model API
export const getTrackItemsByIds = async (limit: number): Promise<{ items: Array<Track>; hasNext: boolean}> => {
    try {
        const response = await fastapi.get(`/random_sample?n=${limit}`, GET_CONFIG);
        const seed_tracks = response.data['ids'];
        const data = await getData(`https://api.spotify.com/v1/tracks?ids=${seed_tracks}`);
        
        return {
            items: data.tracks as Array<Track>,
            hasNext: data.next !== null,
        };

    } catch (error) {
        console.error('Error fetching tracks from the backend:', error);
        throw error;
    }
};

export const getModelTrackRecommendations = async (trackIds: Array<string>, maxOutput: number): Promise<Array<Track>> => {
    const input_tracks = trackIds.join(',');
    const response = await fastapi.post('/recommender', { song_ids: input_tracks, n_songs: maxOutput }, POST_CONFIG);
    const seed_tracks = response.data['ids'];
    const data = await getData(`https://api.spotify.com/v1/tracks?ids=${seed_tracks}`);

    return data.tracks as Array<Track>;
};
