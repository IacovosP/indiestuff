
import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";
import {  PlaylistInterface, PlaylistPageInterface } from "../../types/lib";
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

            const trackRepository = getRepository(Track);
            try {
                const tracks = await trackRepository.find({
                    where: { id: In(playlistTracks.map(playlistTrack => playlistTrack.track.id)) },
                });
                const trackList = tracks.map(track => {
                    const trackWithinPlaylist = playlistTracks.find(playlistTrack => track.id === playlistTrack.track.id);
                    return {
                        ...track,
                        artist: {
                            id: track.artist.id,
                            name: track.artist.name
                        },
                        album: {
                            id: track.album.id,
                            title: track.album.title
                        },
                        positionInPlaylist: trackWithinPlaylist.positionInPlaylist
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
        const { trackId, playlistId } = req.body;

        const playlistTrack = new PlaylistTrack();

        const playlistRepository = getRepository(Playlist);
        const trackRepository = getRepository(Track);
        const playlistTrackRepository = getRepository(PlaylistTrack);
        const lastPositionPromise = playlistTrackRepository.find({ where: { playlist: playlistId}, order: { positionInPlaylist: 'DESC'}, take: 1});
        const [playlist, track, lastPositionTrack] = await Promise.all([playlistRepository.findOne(playlistId), trackRepository.findOne(trackId), lastPositionPromise]);

        playlistTrack.positionInPlaylist = lastPositionTrack && lastPositionTrack[0] ? midString(lastPositionTrack[0].positionInPlaylist) : 'f';
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

    static deletePlaylist = async (req: Request, res: Response) => {
        const { playlistId } = req.params;
        const userId = res.locals.jwtPayload.userId;

        const playlistRepository = getRepository(Playlist);
        const deleteResult = await playlistRepository.delete({id: playlistId, user: userId});
        console.log("delete playlist result: " + JSON.stringify(deleteResult));
        if (deleteResult.affected > 0) {
            res.status(201).send({removedId: playlistId});
            return;
        } else {
            res.status(404).send("Playlist not found or not owned by you"); 
        }
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

    static repositionTrackInPlaylist = async (req: Request, res: Response) => {
        const { trackId, newPosition, playlistId } = req.body;
        
        const playlistTrackRepository = getRepository(PlaylistTrack);

        const trackToChange = await playlistTrackRepository.findOne({where: {track: trackId, playlist: playlistId}});

        if (!trackToChange) {
            res.status(404).send("Track to reposition, not found in playlist");
        }
        trackToChange.positionInPlaylist = newPosition;

        try {
            await playlistTrackRepository.save(trackToChange);
            res.status(200).send({});
        } catch (e) {
            console.log("errors: " + JSON.stringify(e));
            res.status(400).send("failed to reposition track in playlist " + e);
        }
    }
}

function midString(prev: string = "", next: string = "") {
    let p: number, n: number, pos: number, str: string;
    for (pos = 0; p === n; pos++) {
      // find leftmost non-matching character
      p = pos < prev.length ? prev.charCodeAt(pos) : 96;
      n = pos < next.length ? next.charCodeAt(pos) : 123;
    }
    str = prev.slice(0, pos - 1); // copy identical part of string
    if (p === 96) {
      // prev string equals beginning of next
      while (n === 97) {
        // next character is 'a'
        n = pos < next.length ? next.charCodeAt(pos++) : 123; // get char from next
        str += "a"; // insert an 'a' to match the 'a'
      }
      if (n === 98) {
        // next character is 'b'
        str += "a"; // insert an 'a' to match the 'b'
        n = 123; // set to end of alphabet
      }
    } else if (p + 1 === n) {
      // found consecutive characters
      str += String.fromCharCode(p); // insert character from prev
      n = 123; // set to end of alphabet
      while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) === 122) {
        // p='z'
        str += "z"; // insert 'z' to match 'z'
      }
    }
    return str + String.fromCharCode(Math.ceil((p + n) / 2)); // append middle character
  };
  