
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import {  PlaylistInterface } from "@apistuff";
import { Playlist } from "../entity/Playlist";
import { PlaylistTrack } from "../entity/PlaylistTrack";
import { Track } from "../entity/Track";

export default class PlaylistController {
    
    static getPlaylists = async (req: Request, res: Response) => {

        const playlistRepository = getRepository(Playlist);
        const playlists = await playlistRepository.find({ user: res.locals.jwtPayload.userId, relations: ['user'] } as any);

        console.log("playlists :" + JSON.stringify(playlists));
        const result = playlists.map(playlist => {
            return {
                name: playlist.name,
                id: playlist.id
            }
        });

        res.status(200).send(result);
    }

    static createPlaylist = async (req: Request, res: Response) => {
        console.log("playlist " + JSON.stringify(req.body));
        //Get parameters from the body

        const { colour, name } = req.body.playlist as PlaylistInterface;
        const playlist = new Playlist();
        playlist.name = name;
        playlist.colour = colour;
        const errors = await validate(playlist);
        if (errors.length > 0) {
            console.log("errors: " + JSON.stringify(errors));
            res.status(400).send(errors);
            return;
        }

        const playlistRepository = getRepository(Playlist);
        try {
            await playlistRepository.save(playlist);
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
            res.status(400).send("failed to create playlist " + e);
            return false;
        }
        res.status(201).send({id: playlist.id, name: playlist.name});
    }

    static getPlaylist = async (req: Request, res: Response) => {
        console.log("getPlaylist body:" + JSON.stringify(req.body));

        const { playlistId } = req.body;

        const playlistTrackRepository = getRepository(PlaylistTrack);
        let playlistTracks = await playlistTrackRepository.find({ where: { playlist: playlistId}} );
        playlistTracks = playlistTracks.sort((track1, track2) => {
            return track1.positionInPlaylist - track2.positionInPlaylist
        })
        const trackRepository = getRepository(Track);
        const tracks = await trackRepository.find({
                where: { id: In(playlistTracks.map(playlistTrack => playlistTrack.track.id)) },
            });
        res.status(200).send(tracks);
    }

    static addTrackToPlaylist = async (req: Request, res: Response) => {
        console.log("paramst oadd track to request:" + JSON.stringify(req.body));

        const { trackId, playlistId } = req.body;

        const playlistTrack = new PlaylistTrack();

        const playlistRepository = getRepository(Playlist);
        const trackRepository = getRepository(Track);
        const playlistTrackRepository = getRepository(PlaylistTrack);
        const [playlist, track, lastPosition] = await Promise.all([playlistRepository.findOne(playlistId), trackRepository.findOne(trackId), playlistTrackRepository.count({ where: { playlist: playlistId}} )]);

        console.log("last position: " + lastPosition);
        playlistTrack.positionInPlaylist = lastPosition;
        playlistTrack.track = track;
        playlistTrack.playlist = playlist;

        const errors = await validate(playlistTrack);
        if (errors.length > 0) {
            console.log("errors: " + JSON.stringify(errors));
            res.status(400).send(errors);
            return;
        }

        try {
            await playlistTrackRepository.save(playlistTrack);
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
            res.status(400).send("failed to add track to playlist " + e);
            return false;
        }
        res.status(201).send({});
    }
}