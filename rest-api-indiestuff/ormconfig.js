module.exports = {
   "type": process.env.TYPEORM_CONNECTION,
   "host": process.env.TYPEORM_HOST,
   "port": process.env.TYPEORM_PORT,
   "database": process.env.TYPEORM_DATABASE,
   "password": process.env.TYPEORM_PASSWORD,
   "username": process.env.TYPEORM_USERNAME,
   "synchronize": process.env.TYPEORM_SYNCHRONIZE,
   "logging": process.env.TYPEORM_LOGGING,
   entities: [
       "build/entity/**/*.js"
   ],
   migrations: [
       'src/db/migrations/*{.js,.ts}'
   ],
   cli: {
       entitiesDir: 'src/db/entities',
       migrationsDir: 'src/db/migrations',
       subscribersDir: 'src/db/subscribers'
   }
}