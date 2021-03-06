import axios, {AxiosAdapter, AxiosInstance} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import IBSaberPlaylist from '@/lib/data/IBSaberPlaylist';
import PlaylistOnline from '@/lib/PlaylistOnline';

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/';
const API_BASE_URL = 'https://bsaber.com/';
const PLAYLIST_API = 'PlaylistAPI/playlistAPI.json';

export default class BSaberAPI {
  public static Singleton: BSaberAPI = new BSaberAPI();

  public http: AxiosInstance;

  public constructor() {
    this.http = axios.create({
      baseURL: CORS_ANYWHERE + API_BASE_URL,
      adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter)),
    });
  }

  public getPlaylists(): Promise<IBSaberPlaylist[] | undefined> {
    return this.http.get(PLAYLIST_API)
      .then((answer) => {
        const data = answer.data as IBSaberPlaylist[];
        return data.length === 0 ? undefined : data;
      })
      .catch(() => undefined);
  }

  public getPlaylist(playlist: IBSaberPlaylist): Promise<PlaylistOnline | undefined> {
    return this.http.get(CORS_ANYWHERE + playlist.playlistURL)
      .then((answer) => JSON.stringify(answer.data))
      .then(async (raw) => await PlaylistOnline.Parse(raw))
      .catch((e) => {
        // tslint:disable-next-line:no-console
        console.warn(e);
        return undefined;
      });
  }
}
