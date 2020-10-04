
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import {  PlaylistInterface, PlaylistPageInterface } from "@apistuff";
import { Playlist } from "../entity/Playlist";
import { PlaylistTrack } from "../entity/PlaylistTrack";
import { Track } from "../entity/Track";

export default class PlaylistController {
    
    static getPlaylists = async (req: Request, res: Response) => {
        const playlistRepository = getRepository(Playlist);
        const playlists = await playlistRepository.find({ where: { user: res.locals.jwtPayload.userId}});

        const result = playlists.map(playlist => {
            return {
                name: playlist.name,
                id: playlist.id
            }
        });

        res.status(200).send(result);
    }

    static createPlaylist = async (req: Request, res: Response) => {
        const { colour, name } = req.body.playlist as PlaylistInterface;
        const playlist = new Playlist();
        playlist.name = name;
        playlist.colour = colour;
        playlist.user = res.locals.jwtPayload.userId;
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
        const { playlistId } = req.params;

        const playlistRepository = getRepository(Playlist);
        const playlistTrackRepository = getRepository(PlaylistTrack);
        try {
            let [playlist, playlistTracks] = await Promise.all([playlistRepository.findOne({ where: { id: playlistId}} ), playlistTrackRepository.find({ where: { playlist: playlistId}} )])
            playlistTracks = playlistTracks.sort((track1, track2) => {
                return track1.positionInPlaylist - track2.positionInPlaylist
            })
    
            const trackRepository = getRepository(Track);
            try {
                const tracks = await trackRepository.find({
                    where: { id: In(playlistTracks.map(playlistTrack => playlistTrack.track.id)) },
                });
                const trackList = tracks.map(track => {
                    return {
                        ...track,
                        artist: {
                            id: track.artist.id,
                            name: track.artist.name
                        },
                        album: {
                            id: track.album.id,
                            title: track.album.title
                        }
                    }
                });
        
                let albumImages = [];
                for(let i = 0; i < 3; i++) {
                    if (tracks[i] && tracks[i].album && tracks[i].album.album_image_filename) {
                        albumImages.push(tracks[i].album.album_image_filename);
                    } else {
                        break;
                    }
                }
                const result: PlaylistPageInterface = {
                    id: playlistId,
                    albumImages,
                    colour: playlist.colour,
                    name: playlist.name,
                    tracks: trackList,
                    createdAt: playlist.createdAt
                }
                res.status(200).send(result);
            } catch (err) {
                console.error("failed to get tracks and build response: " + err)
                res.status(400).send("Couldn't get playlist tracks");
            }

        } catch (error) {
            console.error("failed to get playlist and playlist tracks: " + error);
            res.status(400).send("Bad Request");
        }
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

    static removeTrackFromPlaylist = async (req: Request, res: Response) => {
        console.log("paramst to remove track to request:" + JSON.stringify(req.body));

        const { trackId, playlistId } = req.body;
        const playlistTrackRepository = getRepository(PlaylistTrack);
        const deleteResult = await playlistTrackRepository.delete({ track: trackId, playlist: playlistId });
        console.log("deelte result: " + JSON.stringify(deleteResult));
        if (deleteResult.affected > 0) {
            res.status(201).send({removedId: trackId});
            return;
        }
        res.status(404).send({errorMessage: "Didn't find anything to delete"});
    }
}