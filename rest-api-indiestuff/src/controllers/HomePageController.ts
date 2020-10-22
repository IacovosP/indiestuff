
import { Request, Response } from "express";
import { getRepository, getManager } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { AlbumPageInterface, ArtistInterface, AlbumInterface, TrackInterface } from "@apistuff";
import { CommentThread } from "../entity/CommentThread";
import { RecentlyPlayedTrack } from "../entity/RecentlyPlayedTrack";

export default class AlbumController {
    
    static getHomePage = async (req: Request, res: Response) => {
        const albumRepository = getRepository(Album);
        const albums = await albumRepository.find({take: 5, select: ["id", "album_image_filename", "artist", "title"], relations: ["artist"] });
        const result = albums.map(album => {
            return {
                ...album,
                artist: {
                    id: album.artist ? album.artist.id: null,
                    name: album.artist ? album.artist.name: null
                }
            }
        });

        // for some reason this only works with raw queries (raw queries get you the track column, where the ORM ones like 'createQueryBuilder' or 'find' do not)
        // const mostPopularTrack = await getManager()
        //     .query('SELECT track as id FROM recently_played_track GROUP BY track ORDER BY COUNT(track) DESC LIMIT 2');

        // const mostPopularTracksIds = mostPopularTrack.map(track => {
        //     return track.id
        // })
        // console.log("most pop tracks ids: " + JSON.stringify(mostPopularTracksIds));
        // const mostPopTrackResult = await getRepository(Track).findByIds(mostPopularTracksIds, { select: ["title", "album", "artist"], relations: ["album"] });
        // console.log("most pop tracks: " + JSON.stringify(mostPopTrackResult));

        res.status(200).send(result);
    }
}