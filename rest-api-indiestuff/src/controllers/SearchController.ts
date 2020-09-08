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

        const result = await Promise.all([SearchController.findFromAlbum(text), SearchController.findFromArist(text), SearchController.findFromTrack(text)])
        res.status(200).send(result);
    }

    static findFromAlbum = async (text: string) => {
        const result = {
            albums: await getRepository(Album)
            .createQueryBuilder("album")
            .select()
            .where("name @@ to_tsquery(:query)", {
              query: `${text}:*`
            })
            // .orderBy(
            //   "ts_rank(document_with_weights, plainto_tsquery(:query))",
            //   "DESC"
            // )
            .getMany()
        } 
    
        return result;
    }

    static findFromArist = async (text: string) => {
        const result = {
           artists: await getRepository(Artist)
            .createQueryBuilder("artist")
            .select()
            .where("name @@ to_tsquery(:query)", {
            query: `${text}:*`
            })
            // .orderBy(
            //   "ts_rank(document_with_weights, plainto_tsquery(:query))",
            //   "DESC"
            // )
            .getMany()
        }
        return result;
    }

    static findFromTrack = async (text: string) => {
        const result = {
            tracks: await getRepository(Track)
                .createQueryBuilder("track")
                .select()
                .where("name @@ to_tsquery(:query)", {
                query: `${text}:*`
                })
                // .orderBy(
                //   "ts_rank(document_with_weights, plainto_tsquery(:query))",
                //   "DESC"
                // )
                .getMany()
        }
        return result;
    }
}