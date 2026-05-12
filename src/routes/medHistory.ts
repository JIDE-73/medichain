import express from "express";
import { createMedHistory, getMedHistoryBySearch, updateMedHistory, deleteMedHistory } from "../controllers/medHistory";

const app = express.Router();

app.post("/create", createMedHistory);
app.get("/read-by-search/:search", getMedHistoryBySearch);
app.put("/update/:id", updateMedHistory);
app.delete("/delete/:id", deleteMedHistory);

export default app;