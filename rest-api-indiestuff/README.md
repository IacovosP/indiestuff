# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command


## To Create a migration
typeorm migration:create -n CreateAdminUser

migrations wiki: https://typeorm.io/#/migrations

## Show process on port and kill it
 netstat -ano | findstr 5000
 tskill 'pid'




 ## Note

 Another RestAPI with authorization: https://github.com/mikesparr/typescript-postgres-auth-example