import { Request, Response } from "express";
import { getRepository, createQueryBuilder } from "typeorm";
import { validate } from "class-validator";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { Artist } from "../entity/Artist";

export default class SearchController {
    
    static find = async (req: Request, res: Response) => {
        const { text } = req.body;
        console.log("text :" + text);

        try {
            const result = await Promise.all([SearchController.findFromAlbum(text), SearchController.findFromArist(text), SearchController.findFromTrack(text)])
            res.status(200).send(result);
        } catch (err) {
            console.error("Something went wrong in query: " + err);
            res.status(201).send({});
        }

    }

    static findFromAlbum = async (text: string) => {
        const textArray = text.split(" ");
        let query = `${text}:*`;
        if (textArray && textArray[1]) {
            query = `${textArray[0]}:* <-> ${textArray[1]}:*`
        }
        try {
            const result = {
                albums: await getRepository(Album)
                .createQueryBuilder("album")
                .select()
                .where("title @@ to_tsquery(:query)", {
                  query
                })
                .getMany()
            } 
            return result;
        } catch (err) {
            throw err;
        }
    }

    static findFromArist = async (text: string) => {
        const textArray = text.split(" ");
        let query = `${text}:*`;
        if (textArray && textArray[1]) {
            query = `${textArray[0]}:* <-> ${textArray[1]}:*`
        }
        try {
            const result = {
            artists: await getRepository(Artist)
                .createQueryBuilder("artist")
                .select()
                .where("name @@ to_tsquery(:query)", {
                query
                })
                .getMany()
            }
            return result;
        } catch (err) {
            throw err;
        }
    }

    static findFromTrack = async (text: string) => {
        const textArray = text.split(" ");
        let query = `${text}:*`;
        if (textArray && textArray[1]) {
            query = `${textArray[0]}:* <-> ${textArray[1]}:*`
        }
        try {
            const result = {
                tracks: await getRepository(Track)
                    .createQueryBuilder("track")
                    .select()
                    .where("title @@ to_tsquery(:query)", {
                    query
                    })
                    // .orderBy(
                    //   "ts_rank(document_with_weights, plainto_tsquery(:query))",
                    //   "DESC"
                    // )
                    .getMany()
            }
            return result;
        } catch (err) {
            throw err;
        }
    }
}