
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";
import { AlbumPageInterface, ArtistInterface, AlbumInterface, TrackInterface } from "@apistuff";
import { CommentThread } from "../entity/CommentThread";
import { RecentlyPlayed } from "../entity/RecentlyPlayed";

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
    const commentThreadRepository = getRepository(CommentThread);
    const commentThread = await commentThreadRepository.findOne({ where: { album: albumId}});
    console.log("comment thread: " + JSON.stringify(commentThread, null , 4));
    const albumResponse: AlbumPageInterface = {
        id: album.id,
        title: album.title,
        album_image_filename: album.album_image_filename,
        releaseDate: album.releaseDate,
        durationInSec: album.durationInSec,
        colour: album.colour,
        artist: artistDetails,
        tracks,
        commentThreadId: commentThread? commentThread.id : null,
        isSingle: album.isSingle
    }
    res.status(200).send(albumResponse);
}

static deleteAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    const userId = res.locals.jwtPayload.userId;

    const albumRepository = getRepository(Album);
    const album = await albumRepository.findOne(albumId);

    if (album) {
        const artistRepository = getRepository(Artist);
        const artist = await artistRepository.findOne({ where: {user: userId}});

        if (artist.id === album.artist.id) {
            // const trackRepository = getRepository(Track);
            // const tracksToRemove = await trackRepository.find({where: {album: albumId}});
            // const deleteTrackResult = await trackRepository.remove(tracksToRemove);

            // const recentlyPlayedRepository = getRepository(RecentlyPlayed);
            // const recentlyPlayedToRemove = await recentlyPlayedRepository.find({where: {album: albumId}});
            // await recentlyPlayedRepository.remove(recentlyPlayedToRemove);

            // const commentThreadRepository = getRepository(CommentThread);
            // const commentThreadToRemove = await commentThreadRepository.find({where: {album: albumId}});
            // await commentThreadRepository.remove(commentThreadToRemove);

            const deleteResult = await albumRepository.delete(albumId);

            console.log("deelte result: " + JSON.stringify(deleteResult));
            if (deleteResult.affected > 0) {
                res.status(201).send({removedId: albumId});
                return;
            } else {
                res.status(400).send(`Found album and artist id matched, but couldn't remove album with id ${albumId} for unknown reason`);
            }
        } else {
            res.status(400).send(`ArtistId for this user doesn't match the artist id for this album with id ${albumId} - Not Removing`);
        }
    } else {
        res.status(404).send(`Couldn't find album with id ${albumId} in order to remove it`);
    }
    console.log("albumId to delete: " + albumId);

}

static editAlbum = async (req: Request, res: Response) => {
    const { id, colour, album_image_filename, title, durationInSec, releaseDate, isSingle } = req.body.editedAlbum as AlbumInterface;

    const albumRepository = getRepository(Album);
    const album = await albumRepository.findOne(id);

    if (!album) {
        res.status(404).send("Album not found"); 
    }

    album.colour = colour;
    album.album_image_filename = album_image_filename;
    album.title = title;
    album.durationInSec = durationInSec;
    album.releaseDate = releaseDate;
    // album.isSingle = isSingle;

    const errors = await validate(album);
    if (errors.length > 0) {
        console.log("errors: " + JSON.stringify(errors));
        res.status(400).send(errors);
        return;
    }

    const artistRepository = getRepository(Artist);
    const artist = await artistRepository.findOne({ where: {user: res.locals.jwtPayload.userId}});

    const tracks = req.body.editedAlbum.tracks as TrackInterface[];
    for(let tr of tracks) {
        let track;
        if (tr.id) {
            const trackRepository = getRepository(Track);
            const oldTrack = await trackRepository.findOne({ where: {id: tr.id, artist: artist}});
            if (!oldTrack) {
                console.warn(`Couldn't find oldTrack for ${tr.id} in db - maybe artist ${artist.id} doesn't match`);
            }

            if (!oldTrack) {
                res.status(404).send("failed to edit album - couldn't find one of the tracks: " + tr.title);
                break;
            }

            if (tr.shouldRemove) {
                const deleteResult = await trackRepository.delete(tr.id);
                console.log("delete track result: " + JSON.stringify(deleteResult));
                if (deleteResult.affected > 0) {
                    // track successfully removed
                } else {
                    console.warn(`Found album and artist id matched, but couldn't remove track with id ${tr.id} for ${deleteResult.raw} unknown reason`);
                }
                continue;
            }
            console.log("checking oldTrack with new to see if anything changed")
            if (oldTrack.positionInAlbum === tr.positionInAlbum && oldTrack.title === tr.title && oldTrack.filename === tr.filename) {
                console.log("return for " + tr.title);
                continue;
            } else {
                track = oldTrack;
                track.positionInAlbum = tr.positionInAlbum;
                track.title = tr.title;
                track.filename = tr.filename;
                track.updatedAt = new Date();
            }
        } else {
            track = new Track();

            track.durationInSec = tr.durationInSec;
            track.title = tr.title;
            track.filename = tr.filename;
            track.positionInAlbum = tr.positionInAlbum;
            track.artist = artist;
            track.album = album;
        }

        const errors = await validate(track);
        if (errors.length > 0) {
            console.log("errors: " + JSON.stringify(errors));
            res.status(400).send(errors);
            break;
        }
        const trackRepository = getRepository(Track);
        try {
            await trackRepository.save(track);
        } catch (err) {
            console.log("errors: " + JSON.stringify(err));
            res.status(400).send(err);
            break;
        }
    };

    try {
        await albumRepository.save(album);
    } catch (e) {
        console.log("errors: " + JSON.stringify(e));
        res.status(400).send("failed to edit album " + e);
        return;
    }
    res.status(201).send({albumId: album.id});
}

static createAlbum = async (req: Request, res: Response): Promise<boolean> => {
    console.log("newUser " + JSON.stringify(req.body));
    //Get parameters from the body
    let { colour, album_image_filename, title, durationInSec, releaseDate, isSingle } = req.body.newAlbum as AlbumInterface;
    const album = new Album();
    const artistRepository = getRepository(Artist);
    const artist = await artistRepository.findOne({ where: {user: res.locals.jwtPayload.userId}});
    album.artist = artist;
    album.colour = colour;
    album.album_image_filename = album_image_filename || "";
    album.title = title;
    album.durationInSec = durationInSec;
    album.releaseDate = releaseDate;
    album.isSingle = isSingle;

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