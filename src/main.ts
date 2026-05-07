import express from "express";
import user from "./routes/user";
import person from "./routes/person";

const app = express();

app.use("/users", user);
app.use("/persons", person);


export default app;
