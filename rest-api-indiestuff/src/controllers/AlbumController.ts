
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";

export default class AlbumController {
    
static getAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    const albumRepository = getRepository(Album);
    const album = await albumRepository.findOne(albumId);

    const trackRepository = getRepository(Track);
    const tracks = await trackRepository.find({ where: { album: albumId}})
    const albumResponse = {
        ...album,
        tracks
    }
    res.status(200).send(albumResponse);
}

static createAlbum = async (req: Request, res: Response): Promise<boolean> => {
    console.log("newUser " + JSON.stringify(req.body));
    //Get parameters from the body
    let { colour, imageFileName, title } = req.body.newAlbum;
    const album = new Album();
    const artistRepository = getRepository(Artist);
    const artist = await artistRepository.findOne({ user: res.locals.jwtPayload.userId, relations: ['user'] });
    album.artist = artist;
    album.colour = colour;
    album.album_image_filename = imageFileName || "";
    album.name = title;
    
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
        track.durationInSeconds = tr.durationInSec;
        track.name = tr.name;
        track.filename = tr.fileName;
        
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
    res.status(201).send("Album created");
  }
}