
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import {  TrackInterfaceForPlaylist, LikedPageInterface } from "@apistuff";
import { Track } from "../entity/Track";
import { LikedTrack } from "../entity/LikedTrack";
import { JsonWebTokenError } from "jsonwebtoken";
import { RecentlyPlayed } from "../entity/RecentlyPlayed";

export default class EventController {
    
    static getRecentlyPlayed = async (req: Request, res: Response) => {

        const likedTracksRepository = getRepository(LikedTrack);
        const likedTracks = await likedTracksRepository.find({ user: res.locals.jwtPayload.userId, relations: ['user', 'track'] } as any);
    }

    static addToRecentlyPlayed = async (req: Request, res: Response) => {
        const { trackId, artistId } = req.body;

        const recentlyPlayedRepository = getRepository(RecentlyPlayed);

        // check if track has been played before
        const recentlyPlayedTrack = await recentlyPlayedRepository.findOne({ where: { track: trackId, user: res.locals.jwtPayload.userId}});
        // need to update the date
        recentlyPlayedTrack.updatedAt = new Date();

        if (!recentlyPlayedTrack) {
            const recentlyPlayed = new RecentlyPlayed();
            recentlyPlayed.track = trackId;
            recentlyPlayed.artist = artistId;
            recentlyPlayed.user = res.locals.jwtPayload.userId;
    
            const errors = await validate(recentlyPlayed);
            if (errors.length > 0) {
                console.log("errors: " + JSON.stringify(errors));
                res.status(400).send(errors);
                return;
            }

            try {
                await recentlyPlayedRepository.save(recentlyPlayed);
                res.status(201).send({});
                return;
            } catch (e) {
                console.log("errors: " + JSON.stringify(e));
                res.status(400).send("failed to add track to recently played tracks " + e);
                return;
            }
        }

        try {
            await recentlyPlayedRepository.save(recentlyPlayedTrack);
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
            res.status(400).send("failed to update track in recently played tracks " + e);
            return;
        }

        res.status(201).send({});
    }
}