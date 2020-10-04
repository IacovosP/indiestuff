
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import {  TrackInterfaceForPlaylist, LikedPageInterface } from "@apistuff";
import { Track } from "../entity/Track";
import { LikedTrack } from "../entity/LikedTrack";
import { JsonWebTokenError } from "jsonwebtoken";

export default class PlaylistController {
    
    static getLikedTracksPlaylist = async (req: Request, res: Response) => {

        const likedTracksRepository = getRepository(LikedTrack);
        const likedTracks = await likedTracksRepository.find({ where: {user: res.locals.jwtPayload.userId}, relations: ['user', 'track'] } as any);

        console.log("liked tracks :"  + JSON.stringify(likedTracks));

        const trackList = likedTracks.map(likedTrack => {
            const trackInPlaylist: TrackInterfaceForPlaylist = {
                id: likedTrack.track.id,
                durationInSec: likedTrack.track.durationInSec,
                artist: {
                    id: likedTrack.track.artist.id,
                    name: likedTrack.track.artist.name
                },
                album: {
                    id: likedTrack.track.album.id,
                    title: likedTrack.track.album.title
                },
                filename: likedTrack.track.filename,
                title: likedTrack.track.title
            }
            return trackInPlaylist;
        });

        let albumImages = [];
        for(let i = 0; i < 3; i++) {
            const likedTrack = likedTracks[i] && likedTracks[i].track;
            if (likedTrack && likedTrack.album && likedTrack.album.album_image_filename) {
                albumImages.push(likedTrack.album.album_image_filename);
            } else {
                break;
            }
        }
        const result: LikedPageInterface  = {
            tracks: trackList,
            albumImages
        }
        res.status(200).send(result);
    }

    static getLikedTracksIdsOnly = async (req: Request, res: Response) => {
        const likedTracksRepository = getRepository(LikedTrack);
        const likedTracks = await likedTracksRepository.find({ where: {user: res.locals.jwtPayload.userId}, relations: ['user', 'track'] } as any);

        const likedTrackIds = likedTracks.map(likedTrack => {
            return likedTrack.track.id
        })

        console.log("result: " + JSON.stringify(likedTrackIds));
        res.status(200).send(likedTrackIds);
    }
    static addTrackToLikedPlaylist = async (req: Request, res: Response) => {
        const { trackId } = req.body;

        const likedTracksRepository = getRepository(LikedTrack);

        try {
            const deleteResult = await likedTracksRepository.delete({ track: trackId });
            console.log("deelte result: " + JSON.stringify(deleteResult));
            if (deleteResult.affected > 0) {
                res.status(201).send({removedId: trackId});
                return;
            }
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
        }

        const likedTrack = new LikedTrack();
        likedTrack.track = trackId;
        likedTrack.user = res.locals.jwtPayload.userId;

        const errors = await validate(likedTrack);
        if (errors.length > 0) {
            console.log("errors: " + JSON.stringify(errors));
            res.status(400).send(errors);
            return;
        }

        try {
            await likedTracksRepository.save(likedTrack);
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
            res.status(400).send("failed to add track to liked tracks " + e);
            return;
        }
        res.status(201).send({});
    }
}