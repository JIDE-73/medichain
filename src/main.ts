import express from "express";
import user from "./routes/user";

const app = express();

app.use("/users", user);

export default app;
