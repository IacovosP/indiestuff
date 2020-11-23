require('dotenv').config();

export default {
  jwtSecret: process.env.JWT_SECRET_KEY,
  awsAccessID: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
  awsS3TrackBucketName: "indie-music-test",
  awsS3ImageBucketName: "indie-image-test",
  awsS3ArtistImageBucketName: "indie-artist-image-test",
  awsS3ArtistTopImageBucketName: "indie-artist-top-image-test"
};