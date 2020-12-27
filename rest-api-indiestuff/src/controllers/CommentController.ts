import { Request, Response } from "express";
import { CommentInterface } from "../../types/lib";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";
import { CommentThread } from "../entity/CommentThread";
import { Artist } from "../entity/Artist";
import { Album } from "../entity/Album";
import { Track } from "../entity/Track";
import { validate } from "class-validator";
import { ReplyComment } from "../entity/ReplyComment";

export default class CommentController {

    static getTrackCommentThread = async (req: Request, res: Response) => {
        const { trackId } = req.params;

        const commentThreadRepository = getRepository(CommentThread);
        const commentThread = await commentThreadRepository.findOne({ where: { track: trackId}});
        if (!commentThread) {
            res.status(200).send({});
            return;
        }
        const commentRepository = getRepository(Comment);
        const comments = await commentRepository.find({ where: { commentThread: commentThread.id}, relations: ['replies']});

        console.log("comments found :" + JSON.stringify(comments, null , 4));
        res.status(200).send({comments, commentThreadId: commentThread.id});
    }

    static getCommentThread = async (req: Request, res: Response) => {
        const { commentThreadId } = req.params;

        const commentRepository = getRepository(Comment);
        let comments = await commentRepository.find({ where: { commentThread: commentThreadId}, relations: ['replies']});

        console.log("comments found :" + JSON.stringify(comments, null , 4));
        res.status(200).send(comments);
    }

    static addComment = async (req: Request, res: Response) => {
        const { text, parentId } = req.body.newComment as CommentInterface;
        const { commentThreadId, artistId, albumId, trackId } = req.body.commentThread;

        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(res.locals.jwtPayload.userId);
            const username = user.username;

            const commentThreadRepository = getRepository(CommentThread);
            const commentRepository = getRepository(Comment);

            if (!parentId) {
                const comment = new Comment();
                comment.text = text;
                comment.username = username;
                comment.userId = user;
    
                if (!commentThreadId) {
                    const commentThread = new CommentThread();

                    if (artistId) {
                        const artistRepository = getRepository(Artist);
                        const artist = await artistRepository.findOne(artistId);
                        commentThread.artist = artist;
                    } else if (albumId) {
                        const albumRepository = getRepository(Album);
                        const album = await albumRepository.findOne(albumId);
                        commentThread.album = album;
                    } else if (trackId) {
                        const trackRepository = getRepository(Track);
                        const track = await trackRepository.findOne(trackId);
                        commentThread.track = track;
                    } else {
                        console.error("no top level id found for commentThread");
                    }
                    comment.commentThread = commentThread;

                    const err = await validate(commentThread);
                    if (err.length > 0) {
                      res.status(400).send(err);
                      return;
                    }
            
                    try {
                        await commentThreadRepository.save(commentThread);
                    } catch (e) {
                        console.error("error in saving comment thread: " + e);
                        res.status(400).send("Failed to add comment in thread");
                    }
                } else {
                    const commentThread = await commentThreadRepository.findOneOrFail(commentThreadId);
                    comment.commentThread = commentThread;
                }

                const errors = await validate(comment);
                if (errors.length > 0) {
                  res.status(400).send(errors);
                  return;
                }
                
                try {
                    await commentRepository.save(comment);
                    res.status(200).send({});
                } catch (e) {
                    console.error("error in saving comment: " + e);
                    res.status(400).send("Failed to add comment");
                }
            } else {
                const parentComment = await commentRepository.findOne(parentId);
                const replyComment = new ReplyComment();
                replyComment.text = text;
                replyComment.username = username;
                replyComment.userId = user;
                replyComment.parentComment = parentComment;

                const replyCommentRepository = getRepository(ReplyComment);

                parentComment.replies = parentComment.replies ? [...parentComment.replies, replyComment] : [replyComment];

                const errors = await validate(parentComment);
                if (errors.length > 0) {
                  res.status(400).send(errors);
                  return;
                }

                const err = await validate(replyComment);
                if (err.length > 0) {
                  res.status(400).send(err);
                  return;
                }

                try {
                    // await commentRepository.save(parentComment);
                    await replyCommentRepository.save(replyComment);
                    res.status(200).send({});
                } catch (error) {
                    console.error("couldn't write reply: " + error);
                    res.status(400).send("Couldn't write reply");
                }
            }
        } catch (error) {
            console.error("error in adding comment: " + error);
            res.status(401).send("Couldn't find user to add comment");
          }
    }
}


