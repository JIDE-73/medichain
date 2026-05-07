import express from "express";
import {
    create,
    update,
    deletee,
    readBySearch,
} from "../controllers/user";

const app = express();

app.post("/create", create);
app.put("/update", update);
app.delete("/delete/:id", deletee);
app.get("/read-by-search/:search", readBySearch);

export default app;