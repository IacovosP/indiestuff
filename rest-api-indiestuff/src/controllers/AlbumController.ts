
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { AlbumPageInterface, ArtistInterface, AlbumInterface, TrackInterface } from "@apistuff";

export default class AlbumController {
    
static getAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    console.log("album id :" + albumId);
    const albumRepository = getRepository(Album);
    const album = await albumRepository.findOne(albumId);
    console.log("album :" + JSON.stringify(album));
    const trackRepository = getRepository(Track);
    const artistRepository = getRepository(Artist);
    const tracks = await trackRepository.find({ where: { album: albumId}})
    console.log("artist id : " + album.artist);
    const artist = await artistRepository.findOne({ where: { id: album.artist.id}})
    console.log("artist: " + JSON.stringify(artist));
    const artistDetails: ArtistInterface = {
        id: artist.id,
        name: artist.name,
        artist_top_image_filename: artist.artist_top_image_filename,
        artist_image_filename: artist.artist_image_filename
    }
    const albumResponse: AlbumPageInterface = {
        id: album.id,
        title: album.title,
        album_image_filename: album.album_image_filename,
        releaseDate: album.releaseDate,
        durationInSec: album.durationInSec,
        colour: album.colour,
        artist: artistDetails,
        tracks
    }
    res.status(200).send(albumResponse);
}

static createAlbum = async (req: Request, res: Response): Promise<boolean> => {
    console.log("newUser " + JSON.stringify(req.body));
    //Get parameters from the body
    let { colour, album_image_filename, title, durationInSec, releaseDate } = req.body.newAlbum as AlbumInterface;
    const album = new Album();
    const artistRepository = getRepository(Artist);
    const artist = await artistRepository.findOne({ user: res.locals.jwtPayload.userId, relations: ['user'] } as any);
    album.artist = artist;
    album.colour = colour;
    album.album_image_filename = album_image_filename || "";
    album.title = title;
    album.durationInSec = durationInSec;
    album.releaseDate = releaseDate;

    const errors = await validate(album);
    if (errors.length > 0) {
        console.log("errors: " + JSON.stringify(errors));
        res.status(400).send(errors);
        return false;
    }
    
    const tracks = req.body.newAlbum.tracks;
    tracks.forEach(async tr => {
        const track = new Track();
        track.artist = artist;
        track.album = album;
        track.durationInSec = tr.durationInSec;
        track.title = tr.title;
        track.filename = tr.filename;
        track.positionInAlbum = tr.positionInAlbum;

        const errors = await validate(track);
        if (errors.length > 0) {
            console.log("errors: " + JSON.stringify(errors));
            res.status(400).send(errors);
            return;
        }
        const trackRepository = getRepository(Track);
        try {
            await trackRepository.save(track);
        } catch (err) {
            console.log("errors: " + JSON.stringify(err));
        }
    });
    const albumRepository = getRepository(Album);
    try {
        await albumRepository.save(album);
    } catch (e) {
        console.log("errors: " + JSON.stringify(e));
        res.status(400).send("failed to create album " + e);
        return false;
    }
    res.status(201).send({albumId: album.id});
  }
}