
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { ArtistInterface, ArtistPageInterface, AlbumInterface } from "@apistuff";
import { CommentThread } from "../entity/CommentThread";

export default class ArtistController {
    
    static getArtist = async (req: Request, res: Response) => {
        const { artistId } = req.params;
        console.log("album id :" + artistId);
        const artistRepository = getRepository(Artist);
        const artist = await artistRepository.findOne(artistId);

        const artistResponse = await getArtistResponse(artist, artistId);
        res.status(200).send(artistResponse);
    }

    static getMyArtistPage = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const artistRepository = getRepository(Artist);
        const artist = await artistRepository.findOne({ where: {user: userId}});

        const artistResponse = await getArtistResponse(artist, artist.id);
        res.status(200).send(artistResponse);
    }
}

const getArtistResponse = async (artist: Artist, artistId: string) => {
    const trackRepository = getRepository(Track);
    const albumRepository = getRepository(Album);

    const albums = await albumRepository.find({ where: { artist: artistId}})
    const tracks = await trackRepository.find({ take: 5, where: { artist: artistId}});
    const commentThreadRepository = getRepository(CommentThread);
    const commentThread = await commentThreadRepository.findOne({ where: { artist: artistId}});
    
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
            id: album.id,
            isSingle: album.isSingle
        }
    })
    const artistResponse: ArtistPageInterface = {
        ...artistDetails,
        albums: albumsDetails,
        topTracks: tracks,
        commentThreadId: commentThread ? commentThread.id : null
    }

    return artistResponse;
}