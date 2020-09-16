
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import {  PlaylistInterface } from "@apistuff";
import { Playlist } from "../entity/Playlist";

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
}