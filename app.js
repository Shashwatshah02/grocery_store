import {getConnection, db} from './db.js';

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();

app.use(bodyParser.json());

getConnection()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});