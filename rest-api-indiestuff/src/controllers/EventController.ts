
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import { RecentlyPlayedPageInterface, AlbumInterface, ArtistInterface } from "@apistuff";
import { Track } from "../entity/Track";
import { LikedTrack } from "../entity/LikedTrack";
import { RecentlyPlayed } from "../entity/RecentlyPlayed";
import { RecentlyPlayedTrack } from "../entity/RecentlyPlayedTrack";

export default class EventController {
    
    static getRecentlyPlayed = async (req: Request, res: Response) => {
        const recentlyPlayedRepository = getRepository(RecentlyPlayed);
        const recentlyPlayedRaw = await recentlyPlayedRepository.find({ where: {user: res.locals.jwtPayload.userId}, relations: ['album', 'artist'], orderBy: "updatedAt", take: 10 } as any);
    
        let recentlyPlayed: Array<AlbumInterface | ArtistInterface> = [];
        for (const recent of recentlyPlayedRaw) {
            console.log("recent: " + JSON.stringify(recent));
            if (recent.isAlbumView) {
                recentlyPlayed.push({
                    id: recent.album.id,
                    title: recent.album.title,
                    colour: recent.album.colour,
                    album_image_filename: recent.album.album_image_filename,
                    releaseDate: recent.album.releaseDate,
                    durationInSec: recent.album.durationInSec,
                    isSingle: recent.album.isSingle
                });
            } else {
                recentlyPlayed.push({
                    id: recent.artist.id,
                    name: recent.artist.name,
                    artist_image_filename: recent.artist.artist_image_filename,
                    artist_top_image_filename: recent.artist.artist_top_image_filename
                });
            }
        }
        const result: RecentlyPlayedPageInterface = {
            recentlyPlayed
        };
        res.status(200).send(result);
    }

    static addToRecentlyPlayed = async (req: Request, res: Response) => {
        const { trackId, albumId, artistId } = req.body;

        const recentlyPlayedRepository = getRepository(RecentlyPlayed);
        const recentlyPlayedTrackRepository = getRepository(RecentlyPlayedTrack);

        let recentlyPlayed;

        // check if track has been played before
        if (artistId || albumId) {
            if (artistId) {
                recentlyPlayed = await recentlyPlayedRepository.findOne({ where: { artist: artistId, user: res.locals.jwtPayload.userId}});
            } else if (albumId) {
                recentlyPlayed = await recentlyPlayedRepository.findOne({ where: { album: albumId, user: res.locals.jwtPayload.userId}});
            }

            if (recentlyPlayed) {
                const currentDate = new Date();
                // need to update the date
                recentlyPlayed.updatedAt = currentDate;
                recentlyPlayed.isAlbumView = !!albumId;
                recentlyPlayed.album = albumId ? albumId: null;

                let recentlyPlayedTrack;
                recentlyPlayedTrack = await recentlyPlayedTrackRepository.findOne({where: {track: trackId, user: res.locals.jwtPayload.userId}});

                if (recentlyPlayedTrack) {
                    recentlyPlayedTrack.updatedAt = currentDate;
                } else {
                    recentlyPlayedTrack = new RecentlyPlayedTrack();
                    recentlyPlayedTrack.track = trackId;
                    recentlyPlayedTrack.user = res.locals.jwtPayload.userId;
                    recentlyPlayedTrack.recentlyPlayed = recentlyPlayed;

                    recentlyPlayed.recentlyPlayedTracks = recentlyPlayed.recentlyPlayedTracks ? [...recentlyPlayed.recentlyPlayedTracks, recentlyPlayedTrack] : recentlyPlayed.recentlyPlayedTracks;
                }

                const errors = await validate(recentlyPlayed);
                if (errors.length > 0) {
                    console.log("existing recentlyPlayed errors: " + JSON.stringify(errors));
                    res.status(400).send(errors);
                    return;
                }
    
                const err = await validate(recentlyPlayedTrack);
                if (err.length > 0) {
                    console.log("new recentlyPlayedTrack err: " + JSON.stringify(errors));
                    res.status(400).send(err);
                    return;
                }

                
                try {
                    await Promise.all([recentlyPlayedRepository.save(recentlyPlayed), recentlyPlayedTrackRepository.save(recentlyPlayedTrack)]);
                } catch (e) {
                    console.log("errors: " + JSON.stringify(e));
                    res.status(400).send("failed to update track in recently played tracks " + e);
                    return;
                }
        
                res.status(201).send({});
            }
        }

        if (!recentlyPlayed) {
            const recentlyPlayed = new RecentlyPlayed();
            recentlyPlayed.album = albumId ? albumId : null;
            recentlyPlayed.artist = artistId ? artistId : null;
            recentlyPlayed.user = res.locals.jwtPayload.userId;
            recentlyPlayed.isAlbumView = !!albumId;

            const recentlyPlayedTrack = new RecentlyPlayedTrack();
            recentlyPlayedTrack.track = trackId;
            recentlyPlayedTrack.recentlyPlayed = recentlyPlayed;
            recentlyPlayedTrack.user = res.locals.jwtPayload.userId;

            recentlyPlayed.recentlyPlayedTracks = [recentlyPlayedTrack];

            const errors = await validate(recentlyPlayed);
            if (errors.length > 0) {
                console.log("recentlyPlayed errors: " + JSON.stringify(errors));
                res.status(400).send(errors);
                return;
            }

            const err = await validate(recentlyPlayedTrack);
            if (err.length > 0) {
                console.log("recentlyPlayedTrack err: " + JSON.stringify(errors));
                res.status(400).send(err);
                return;
            }

            try {
                await Promise.all([recentlyPlayedRepository.save(recentlyPlayed), recentlyPlayedTrackRepository.save(recentlyPlayedTrack)]);
                res.status(201).send({});
                return;
            } catch (e) {
                console.log("errors: " + JSON.stringify(e));
                res.status(400).send("failed to add track to recently played tracks " + e);
                return;
            }
        }
    }
}