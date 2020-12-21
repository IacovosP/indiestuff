
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Artist } from "../entity/Artist";
import { Track } from "../entity/Track";

export default class TrackController {

    static deleteTrack = async (req: Request, res: Response) => {
        const { trackId } = req.params;
        const userId = res.locals.jwtPayload.userId;

        const trackRepository = getRepository(Track);
        const track = await trackRepository.findOne(trackId);
        if (!track) {
            res.status(404).send("Track not found"); 
            return;
        }

        const artistRepository = getRepository(Artist);
        const artist = await artistRepository.findOne({ where: {user: userId}});

        if (artist.id === track.artist.id) {
            const deleteResult = await trackRepository.delete(trackId);
            console.log("deelte result: " + JSON.stringify(deleteResult));
            if (deleteResult.affected > 0) {
                res.status(201).send({removedId: trackId});
                return;
            } else {
                res.status(400).send(`Found album and artist id matched, but couldn't remove track with id ${trackId} for unknown reason`);
            }
        } else {
            res.status(400).send(`ArtistId for this user doesn't match the artist id for this track with id ${trackId} - Not Removing`);
        }
    }
}