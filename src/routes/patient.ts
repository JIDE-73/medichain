import express from "express";
import { update } from "../controllers/patients";

const router = express.Router();

router.put("/update/:id", update);

export default router;