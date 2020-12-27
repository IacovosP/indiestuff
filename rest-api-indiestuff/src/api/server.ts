// from https://github.com/andregardi/jwt-express-typeorm
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import * as express from "express"; 
import * as bodyParser from "body-parser";
import * as  helmet from "helmet";
import * as cors from "cors";
import routes from "../routes";
import { Server as HttpServer } from 'http';

export class Server {
    private _app: express.Application;
    public connection: Connection;
    private server: HttpServer;

    public get app(): express.Application {
        return this._app;
    }
    public set app(value: express.Application) {
        this._app = value;
    }
    
    public createApp() {
        // Create a new express application instance
        this.app = express();

        // Call midlewares
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(bodyParser.json());

        //Set all routes from routes folder
        this.app.use("/", routes);
        this.server = this.app.listen(process.env.EXPRESS_PORT, () => {
            console.log(`Server started on port ${process.env.EXPRESS_PORT}!`);
        });
          
        process.on("SIGINT", () => {
            //graceful shutdown
            this.closeConnection();
            process.exit(1);
        });
    }

    public async createConnection() {
        return this.connection = await createConnection();
    }

    public closeConnection() {
        console.log("closing connection");
        this.server.close();
    }
}
