
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import config from "../config/config";
import { Artist } from "../entity/Artist";
const formidable = require('formidable');
const util = require('util');
const fs = require('fs');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

let newS3FileName: string;

const s3 = new AWS.S3({
  accessKeyId: config.awsAccessID,
  secretAccessKey: config.awsSecret
});

export const uploadTrack = multer({
  storage: multerS3({
      s3: s3,
      bucket: config.awsS3TrackBucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log(file);
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, getNewS3FileName(file.originalname));
      }
  })
});

export const uploadImage = multer({
  storage: multerS3({
      s3: s3,
      bucket: config.awsS3ImageBucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log(file);
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, getNewS3FileName(file.originalname));
      }
  })
});

export const uploadArtistImage = multer({
  storage: multerS3({
      s3: s3,
      bucket: config.awsS3ArtistImageBucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log(file);
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, getNewS3FileName(file.originalname));
      }
  })
});

export const uploadArtistTopImage = multer({
  storage: multerS3({
      s3: s3,
      bucket: config.awsS3ArtistTopImageBucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log(file);
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, getNewS3FileName(file.originalname));
      }
  })
});

const getNewS3FileName = (name: string) => {
  newS3FileName = Date.now().toString() + '_' + name;

  return newS3FileName;
}

const singleTrackUpload = uploadTrack.single("myFile");
const singleImageUpload = uploadImage.single("myFile");
const singleArtistTopImageUpload = uploadArtistTopImage.single("myFile");
const singleArtistImageUpload = uploadArtistImage.single("myFile");

export default class UploadController {
  static artistTopImage = async (req: Request, res: Response) => {
    singleArtistTopImageUpload(req, res, async err => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: "Image Upload Error",
            detail: err.message,
            error: err,
          },
        });
      } 
      const filename = (res.req as any).file.key;
      const artistRepository = getRepository(Artist);
      const artist = await artistRepository.findOne({ where: {user: res.locals.jwtPayload.userId}});
      artist.artist_top_image_filename = filename;

      try {
        await artistRepository.save(artist);
      } catch (e) {
        console.error("error in updating artist image " + e);
        res.status(400).send("failed to update artist image");
        return;
      }
      res.status(200).send({});
      return;
    });
  }

  static artistImage = async (req: Request, res: Response) => {
    singleArtistImageUpload(req, res, async err => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: "Image Upload Error",
            detail: err.message,
            error: err,
          },
        });
      } 
      const filename = (res.req as any).file.key;
      const artistRepository = getRepository(Artist);
      const artist = await artistRepository.findOne({ where: {user: res.locals.jwtPayload.userId}});
      artist.artist_image_filename = filename;

      try {
        await artistRepository.save(artist);
      } catch (e) {
        console.error("error in updating artist image " + e);
        res.status(400).send("failed to update artist image");
        return;
      }
      res.status(200).send({});
      return;
    });
  }

  static image = async (req: Request, res: Response) => {
    singleImageUpload(req, res, err => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: "Image Upload Error",
            detail: err.message,
            error: err,
          },
        });
      } 
      res.status(200).send({filename: (res.req as any).file.key});
      return;
    });
  }

static track = async (req: Request, res: Response) => {
  singleTrackUpload(req, res, err => {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Audio Track Upload Error",
          detail: err.message,
          error: err,
        },
      });
    } 
    res.status(200).send({filename: (res.req as any).file.key});
    return;
  });
};

static notUsed = async (req: Request, res: Response) => {
  // Instantiate a new formidable form for processing.
  var form = new formidable.IncomingForm();

  // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

  form.parse(req, function(err, fields, files) {
    if (err) {

        // Check for and handle any errors here.
        console.error(err.message);
        return;
    }

    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    // This last line responds to the form submission with a list of the parsed data and files.
    res.end(util.inspect({fields: fields, files: files}));
  });
  return;
};



}