
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { AlbumPageInterface, ArtistInterface, AlbumInterface, TrackInterface } from "@apistuff";
import { CommentThread } from "../entity/CommentThread";

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
        res.status(200).send(result);
    }
}