
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { ArtistInterface, TrackInterface, ArtistPageInterface, AlbumInterface } from "@apistuff";

export default class ArtistController {
    
    static getArtist = async (req: Request, res: Response) => {
        const { artistId } = req.params;
        console.log("album id :" + artistId);
        const artistRepository = getRepository(Artist);
        const artist = await artistRepository.findOne(artistId);

        const trackRepository = getRepository(Track);
        const albumRepository = getRepository(Album);

        const albums = await albumRepository.find({ where: { artist: artistId}})
        const tracks = await trackRepository.find({ take: 5, where: { artist: artistId}});

        const artistDetails: ArtistInterface = {
            id: artist.id,
            name: artist.name,
            artist_top_image_filename: artist.artist_top_image_filename,
            artist_image_filename: artist.artist_image_filename
        }

        const albumsDetails: AlbumInterface[] = albums.map(album => {
            return {
                album_image_filename: album.album_image_filename,
                colour: album.colour,
                durationInSec: album.durationInSec,
                releaseDate: album.releaseDate,
                title: album.title,
                id: album.id
            }
        })
        const artistResponse: ArtistPageInterface = {
            ...artistDetails,
            albums: albumsDetails,
            topTracks: tracks
        }
        res.status(200).send(artistResponse);
    }
}