import 'reflect-metadata';
import 'source-map-support/register';
// import 'module-alias/register';

// Set env to test
process.env.NODE_ENV = 'test';

// Set env variables from .env file
import { config } from 'dotenv';
config();

import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import * as express from "express";
import * as supertest from 'supertest';

// import { env } from '@config/globals';

import { Server } from '../api/server';

/**
 * TestFactory
 * - Loaded in each unit test
 * - Starts server and DB connection
 */

export class TestFactory {
    private _app: express.Application;
    private _connection: Connection;
    private _server: HttpServer;
    private myServer;
    // DB connection options
    // private options: ConnectionOptions = {

    private options: any = {
        type: 'postgres',
        database: "test.postgresql",
        password: "testPassword",
        location: 'database',
        logging: false,
        synchronize: true,
        entities: [
            "src/entity/**/*.ts"
         ],
    };

    public get app(): supertest.SuperTest<supertest.Test> {
        return supertest(this._app);
    }

    public get connection(): Connection {
        return this._connection;
    }

    public get server(): HttpServer {
        return this._server;
    }

    /**
     * Connect to DB and start server
     */
    public async init(): Promise<void> {
        this._connection = await createConnection(this.options);
        this.myServer = new Server();
        this.myServer.connection = this._connection;
        this.myServer.createApp();
        this._app = this.myServer.app;
        // this._server = createServer(this._app).listen(5000);
    }

    /**
     * Close server and DB connection
     */
    public async close(): Promise<void> {
        // this._server.close();
        this._connection.close();
        this.myServer.closeConnection();
    }
}
