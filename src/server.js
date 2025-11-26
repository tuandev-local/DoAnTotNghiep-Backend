import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import { connectdb } from "./config/connectdb";
import cors from "cors";


require('dotenv').config({ path: './src/.env' });



let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', withCredentials: true }));



viewEngine(app);
initWebRoutes(app);
connectdb();

let port = process.env.PORT;
app.listen(port, () => {
    console.log('Backend Nodejs running on port: ' + port)
})

