import express from 'express';
import apiRouter from "./api/apiRouter";

const app = express();
const port = 3000;

export const startRestAPI = () => {
    app.use(express.json());

    app.use('/app', express.static('src/rest-API/webapp'));
    app.use('/api', apiRouter);

    app.listen(port, () => {
        console.log(`📡 Rest API listening at http://localhost:${port}`);
    });
}