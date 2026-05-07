import express from "express";
import {
    createWithDoctor,
    createWithPatient,
    update,
    deletee,
    readBySearch,
} from "../controllers/person";

const app = express();

app.post("/create-with-doctor", createWithDoctor);
app.post("/create-with-patient", createWithPatient);
app.put("/update", update);
app.delete("/delete/:id", deletee);
app.get("/read-by-search/:search", readBySearch);

export default app;