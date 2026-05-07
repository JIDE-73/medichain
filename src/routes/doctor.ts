import express from "express";
import {
    update,
    deletee,
    readBySearch,
} from "../controllers/doctor";

const app = express();

app.put("/update/:id", update);
app.delete("/delete/:id", deletee);
app.get("/read-by-search/:search", readBySearch);

export default app;